using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly VinFastDbContext _context;

        public OrderService(VinFastDbContext context) => _context = context;

        public async Task<OrderDto> CreateOrderFromCartAsync(long userId, CheckoutRequest req)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.NguoiDungId == userId)
                .ToListAsync();

            if (!cartItems.Any()) throw new Exception("Giỏ hàng trống");
            // Tự động gán DaiLyId = 1 nếu không có
            long daiLyId = req.DaiLyId ?? 1;
            var order = new Order
            {
                NguoiDungId = userId,
                DaiLyId = daiLyId,                    // ← Sử dụng giá trị mặc định
                TrangThaiDonHang = "Pending",
                SoTienDatCoc = cartItems.Sum(i => i.Gia) * 0.2m,
                TongTien = cartItems.Sum(i => i.Gia),
                ThoiGianTao = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in cartItems)
            {
                _context.OrderItems.Add(new OrderItem
                {
                    DonHangId = order.Id,
                    XeId = item.XeId,
                    CauHinhXe = item.CauHinhXe,
                    Gia = item.Gia,
                    SoLuong = item.SoLuong ?? 1
                });
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return new OrderDto
            {
                Id = order.Id,
                TrangThaiDonHang = order.TrangThaiDonHang,
                TongTien = order.TongTien,
                SoTienDatCoc = order.SoTienDatCoc,
                ThoiGianTao = order.ThoiGianTao ?? DateTime.UtcNow,
                Items = cartItems.Select(i => new OrderItemDto
                {
                    XeId = i.XeId,
                    CauHinhXe = i.CauHinhXe,
                    Gia = i.Gia
                }).ToList()
            };
        }

        public async Task<bool> SaveCustomerInfoAsync(long userId, CustomerInfoRequest req)
        {
            var order = await _context.Orders
                .Where(o => o.NguoiDungId == userId && o.TrangThaiDonHang == "Pending")
                .OrderByDescending(o => o.ThoiGianTao)
                .FirstOrDefaultAsync();

            if (order == null) throw new Exception("Không tìm thấy đơn hàng");

            _context.OrderCustomerInfos.Add(new OrderCustomerInfo
            {
                DonHangId = order.Id,
                HoTen = req.HoTen,
                SoDienThoai = req.SoDienThoai,
                Email = req.Email,
                DiaChiKhachHang = req.DiaChiKhachHang,
                SoCccd = req.SoCccd
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<OrderDto>> GetMyOrdersAsync(long userId)
        {
            return await _context.Orders
                .Where(o => o.NguoiDungId == userId)
                .Include(o => o.OrderItems)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    TrangThaiDonHang = o.TrangThaiDonHang,
                    TongTien = o.TongTien,
                    SoTienDatCoc = o.SoTienDatCoc,
                    ThoiGianTao = o.ThoiGianTao ?? DateTime.UtcNow,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        XeId = oi.XeId,
                        CauHinhXe = oi.CauHinhXe,
                        Gia = oi.Gia
                    }).ToList()
                })
                .ToListAsync();
        }

        // === DEALER STAFF METHODS ===
        public async Task<List<DealerOrderDto>> GetDealerOrdersAsync(long dealerId, string? status)
        {
            var query = _context.Orders
        .Include(o => o.NguoiDung)
        .Include(o => o.OrderItems).ThenInclude(oi => oi.Xe)
        .Where(o => o.DaiLyId == dealerId);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.TrangThaiDonHang == status);

            var orders = await query.OrderByDescending(o => o.Id).ToListAsync();

            var allOptions = await _context.Options.ToListAsync();
            // Giả sử bạn có bảng CarVersions để lấy tên phiên bản
            var allVersions = await _context.CarVersions.ToListAsync();

            return orders.Select(o => new DealerOrderDto
            {
                Id = o.Id,
                CustomerName = o.NguoiDung?.HoTen ?? "Khách hàng",
                Status = o.TrangThaiDonHang,
                TongTien = o.TongTien,
                SoTienDatCoc = o.SoTienDatCoc,
                ThoiGianTao = o.ThoiGianTao ?? DateTime.UtcNow,
                Items = o.OrderItems.Select(oi =>
                {
                    // Parse JSON cấu hình xe
                    var configData = new Dictionary<string, string>();
                    try
                    {
                        configData = JsonSerializer.Deserialize<Dictionary<string, string>>(oi.CauHinhXe)
                                     ?? new Dictionary<string, string>();
                    }
                    catch { /* Xử lý nếu JSON lỗi */ }
                    var displayOptions = new List<OptionDisplayDto>();

                    // Khởi tạo các giá trị mặc định từ bảng CarVersion
                    long pbId = 0;
                    string tenPB = "N/A";
                    decimal giaPB = 0;

                    // 1. Tìm thông tin phiên bản từ phienBanId trong JSON
                    if (configData.TryGetValue("phienBanId", out var pbIdStr) && long.TryParse(pbIdStr, out pbId))
                    {
                        var versionInfo = allVersions.FirstOrDefault(v => v.Id == pbId);
                        if (versionInfo != null)
                        {
                            tenPB = versionInfo.TenPhienBan;
                            giaPB = versionInfo.GiaCoBan;
                        }
                    }

                    // 2. Map các option khác (Màu sắc, pin...) để lấy giá chênh lệch
                    foreach (var entry in configData)
                    {
                        // Bỏ qua các key không phải option cần tính giá (như phienBanId)
                        if (entry.Key == "phienBanId" || string.IsNullOrEmpty(entry.Value)) continue;

                        // So sánh chính xác hơn bằng cách Trim() và ToLower()
                        var optValue = entry.Value.Trim().ToLower();
                        var optInfo = allOptions.FirstOrDefault(x =>
                            x.XeId == oi.XeId &&
                            x.TenTuyChon.Trim().ToLower() == optValue);

                        displayOptions.Add(new OptionDisplayDto
                        {
                            Nhan = entry.Key,
                            GiaTri = entry.Value,
                            GiaChenhLech = optInfo?.AnhHuongDenGia ?? 0
                        });
                    }

                    return new OrderDetailItemDto
                    {
                        TenXe = oi.Xe?.MauXe ?? "N/A",
                        PhienBanId = pbId,
                        TenPhienBan = tenPB,
                        GiaPhienBan = giaPB,
                        SoLuong = oi.SoLuong ?? 1,
                        GiaCuoi = oi.Gia,
                        ChiTietCauHinh = displayOptions
                    };
                }).ToList()
            }).ToList();
        }

        public async Task ConfirmOrderAsync(long orderId, long dealerId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.DaiLyId != dealerId)
                throw new Exception("Đơn hàng không tồn tại hoặc không thuộc đại lý");

            order.TrangThaiDonHang = "Confirmed";
            await _context.SaveChangesAsync();

            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                DonHangId = orderId,
                TrangThai = "Confirmed",
                NguoiCapNhat = dealerId,
                ThoiGianCapNhat = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        public async Task UpdateOrderStatusAsync(long orderId, UpdateStatusRequest req, long dealerId)
        {
            // Load đơn hàng kèm theo chi tiết xe và phiên bản
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.DaiLyId == dealerId);

            if (order == null) throw new Exception("Đơn hàng không tồn tại");

            string oldStatus = order.TrangThaiDonHang;
            string newStatus = req.NewStatus;

            // Chỉ xử lý kho nếu trạng thái thực sự thay đổi
            if (oldStatus != newStatus)
            {
                foreach (var item in order.OrderItems)
                {
                    // Tìm sản phẩm trong kho của đại lý dựa trên Xe và Phiên bản
                    // Lưu ý: item.PhienBanId cần được lưu từ lúc khách thêm vào giỏ hàng
                    var inventory = await _context.DealerInventories
                        .FirstOrDefaultAsync(i => i.DaiLyId == dealerId
                                             && i.XeId == item.XeId
                                             /* && i.PhienBanId == item.PhienBanId */); // Mở comment này khi bạn đã thêm PhienBanId vào OrderItem

                    if (inventory != null)
                    {
                        int quantity = item.SoLuong ?? 1;

                        // 1. Khi xác nhận đơn (Confirmed): Tăng số lượng tạm giữ
                        if (oldStatus == "Pending" && newStatus == "Confirmed")
                        {
                            inventory.SoLuongTamGiu += quantity;
                        }

                        // 2. Khi bàn giao xe (Delivered): Trừ tồn kho thực tế và giải phóng tạm giữ
                        else if (newStatus == "Delivered")
                        {
                            inventory.SoLuongTonKho -= quantity;
                            inventory.SoLuongTamGiu -= quantity;
                        }

                        // 3. Khi khách hủy đơn (Cancelled): Trừ số lượng tạm giữ (nếu trước đó đã confirmed)
                        else if (newStatus == "Cancelled" && (oldStatus == "Confirmed" || oldStatus == "Paid"))
                        {
                            inventory.SoLuongTamGiu -= quantity;
                            if (inventory.SoLuongTamGiu < 0) inventory.SoLuongTamGiu = 0; // Guard clause
                        }
                    }
                }

                // Cập nhật trạng thái và lưu lịch sử
                order.TrangThaiDonHang = newStatus;
                order.UpdatedAt = DateTime.UtcNow;

                _context.OrderStatusHistories.Add(new OrderStatusHistory
                {
                    DonHangId = orderId,
                    TrangThai = newStatus,
                    NguoiCapNhat = dealerId,
                    ThoiGianCapNhat = DateTime.UtcNow
                });

                await _context.SaveChangesAsync();
            }
        }
    }
}