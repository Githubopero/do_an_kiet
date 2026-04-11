using Microsoft.EntityFrameworkCore;
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
            if (!req.DaiLyId.HasValue) throw new Exception("Chưa chọn đại lý");

            var order = new Order
            {
                NguoiDungId = userId,
                DaiLyId = req.DaiLyId,
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
                .Where(o => o.DaiLyId == dealerId);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.TrangThaiDonHang == status);

            return await query.Select(o => new DealerOrderDto
            {
                Id = o.Id,
                CustomerName = o.NguoiDung.HoTen,
                Status = o.TrangThaiDonHang,
                TongTien = o.TongTien,
                ThoiGianTao = o.ThoiGianTao ?? DateTime.UtcNow
            }).ToListAsync();
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
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.DaiLyId != dealerId)
                throw new Exception("Không có quyền cập nhật đơn này");

            order.TrangThaiDonHang = req.NewStatus;
            order.UpdatedAt = DateTime.UtcNow;

            _context.OrderStatusHistories.Add(new OrderStatusHistory
            {
                DonHangId = orderId,
                TrangThai = req.NewStatus,
                NguoiCapNhat = dealerId,
                ThoiGianCapNhat = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
    }
}