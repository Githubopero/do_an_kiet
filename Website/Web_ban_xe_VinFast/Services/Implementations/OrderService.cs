using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.Helpers;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly VinFastDbContext _context;
        private readonly IConfiguration _config;
        public OrderService(VinFastDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<OrderDto> CreateOrderFromCartAsync(long userId, CheckoutRequest req)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.NguoiDungId == userId)
                .ToListAsync();
            // Khai báo option để đọc được cả chữ hoa lẫn chữ thường
            var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

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
                long phienBanId = 0;
                try
                {
                    // Cách 1: Nếu bạn có Class ConfigPriceRequest (Khuyên dùng)
                    // var config = JsonSerializer.Deserialize<Web_ban_xe_VinFast.DTOs.Order.ConfigPriceRequest>(item.CauHinhXe, jsonOptions);
                    // if (config != null) phienBanId = config.PhienBanId;

                    // Cách 2: Dùng JsonDocument (Linh hoạt, không cần tạo class mới)
                    using (JsonDocument doc = JsonDocument.Parse(item.CauHinhXe))
                    {
                        JsonElement root = doc.RootElement;
                        // Kiểm tra cả 'PhienBanId' và 'phienBanId'
                        if (root.TryGetProperty("PhienBanId", out JsonElement pbElement) ||
                            root.TryGetProperty("phienBanId", out pbElement))
                        {
                            phienBanId = pbElement.GetInt64();
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log lỗi nếu cần: Console.WriteLine(ex.Message);
                }

                // KIỂM TRA QUAN TRỌNG: Nếu phienBanId vẫn bằng 0, đơn hàng sẽ lỗi khóa ngoại
                if (phienBanId == 0)
                {
                    throw new Exception($"Lỗi: Sản phẩm {item.XeId} trong giỏ hàng thiếu thông tin phiên bản hợp lệ.");
                }

                _context.OrderItems.Add(new OrderItem
                {
                    DonHangId = order.Id,
                    XeId = item.XeId,
                    PhienBanId = phienBanId,
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
            // Lấy danh sách options để map tên cho đẹp
            var allOptions = await _context.Options.ToListAsync();

            return await _context.Orders
                .Where(o => o.NguoiDungId == userId)
                .Include(o => o.OrderItems).ThenInclude(oi => oi.Xe) // Load thêm bảng Xe
                .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.PhienBan) // Đảm bảo đã Include PhienBan để lấy tên
                .OrderByDescending(o => o.Id)
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
                        // Kết hợp Tên xe + Tên phiên bản để Frontend hiển thị cho đẹp
                        MauXe = $"{oi.Xe.MauXe} - {oi.PhienBan.TenPhienBan}",
                        CauHinhXe = oi.CauHinhXe,
                        Gia = oi.Gia,
                        SoLuong = oi.SoLuong ?? 1
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
                          && i.PhienBanId == item.PhienBanId); // BẮT BUỘC dùng PhienBanId

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



        //tích hợp thanh toán vnpay
        //public async Task<string> CreatePaymentUrl(long orderId, HttpContext context)
        //{
        //    var order = await _context.Orders.FindAsync(orderId);
        //    if (order == null) throw new Exception("Đơn hàng không tồn tại");

        //    var vnpay = new VnPayLibrary();
        //    // 1. Thêm dữ liệu yêu cầu
        //    vnpay.AddRequestData("vnp_Version", "2.1.0");
        //    vnpay.AddRequestData("vnp_Command", "pay");
        //    vnpay.AddRequestData("vnp_TmnCode", _config["Vnpay:TmnCode"]); // Lấy từ Config
        //    vnpay.AddRequestData("vnp_Amount", ((long)(order.SoTienDatCoc * 100)).ToString());
        //    vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
        //    vnpay.AddRequestData("vnp_CurrCode", "VND");
        //    vnpay.AddRequestData("vnp_IpAddr", context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
        //    vnpay.AddRequestData("vnp_Locale", "vn");
        //    vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan coc xe cho don hang: {order.Id}");
        //    vnpay.AddRequestData("vnp_OrderType", "other");
        //    vnpay.AddRequestData("vnp_ReturnUrl", "http://localhost:3000/payment-success"); // Trang ReactJS
        //    vnpay.AddRequestData("vnp_TxnRef", order.Id.ToString()); // ID đơn hàng để đối soát

        //    // 2. Tạo URL
        //    string paymentUrl = vnpay.CreateRequestUrl(_config["Vnpay:BaseUrl"], _config["Vnpay:HashSecret"]);

        //    // 3. Lưu thông tin vào bảng Payment (Trạng thái ban đầu là Pending)
        //    var payment = new Payment
        //    {
        //        DonHangId = order.Id,
        //        SoTienThanhToan = order.SoTienDatCoc,
        //        PhuongThucThanhToan = "VNPAY",
        //        TrangThaiThanhToan = "Pending",
        //        MaGiaoDich = "", // Sẽ cập nhật khi có kết quả
        //        DuongDanThanhToan = paymentUrl,
        //        ThoiGianTao = DateTime.UtcNow
        //    };
        //    _context.Payments.Add(payment);
        //    await _context.SaveChangesAsync();

        //    return paymentUrl;
        //}

        public async Task<string> CreatePaymentUrl(long orderId, HttpContext context)
        {
            var order = await _context.Orders.FindAsync(orderId);

            // --- ĐOẠN GIẢ LẬP BẮT ĐẦU ---
            // 1. Cập nhật trạng thái đơn hàng thành đã thanh toán ngay lập tức
            order.TrangThaiDonHang = "Paid";

            // 2. Tạo một bản ghi Payment giả
            var payment = new Payment
            {
                DonHangId = orderId,
                SoTienThanhToan = order.TongTien,
                PhuongThucThanhToan = "VNPAY_SIMULATED",
                TrangThaiThanhToan = "Success",
                MaGiaoDich = "SIMULATE_" + DateTime.Now.Ticks,
                DuongDanThanhToan = "Simulated",
                ThoiGianTao = DateTime.Now
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // 3. Trả về thẳng link trang "Cảm ơn" hoặc "Thành công" ở Frontend của bạn
            return "http://localhost:5173/customer/payment-success?orderId=" + orderId;
            // --- ĐOẠN GIẢ LẬP KẾT THÚC ---
        }
        public async Task<bool> ProcessVnpayIpn(IQueryCollection vnpayData)
        {
            // Logic kiểm tra chữ ký (Checksum) từ VNPAY gửi về
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in vnpayData)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                    vnpay.AddResponseData(key, value);
            }

            long orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            string vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            string vnp_TransactionNo = vnpay.GetResponseData("vnp_TransactionNo");
            // Thành dòng này:
            bool checkSignature = vnpay.ValidateSignature(vnpayData["vnp_SecureHash"], _config["Vnpay:HashSecret"]);

            if (checkSignature && vnp_ResponseCode == "00")
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order != null)
                {
                    // Cập nhật trạng thái đơn hàng
                    order.TrangThaiDonHang = "Paid";

                    // Cập nhật bảng Payment
                    var payment = await _context.Payments.FirstOrDefaultAsync(p => p.DonHangId == orderId);
                    if (payment != null)
                    {
                        payment.TrangThaiThanhToan = "Success";
                        payment.MaGiaoDich = vnp_TransactionNo;
                    }

                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
    }
}