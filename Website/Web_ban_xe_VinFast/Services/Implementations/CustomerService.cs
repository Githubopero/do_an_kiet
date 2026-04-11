using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CustomerService
    {
        private readonly VinFastDbContext _context;

        public CustomerService(VinFastDbContext context) => _context = context;

        public async Task<List<CustomerDto>> GetCustomersByDealerAsync(long dealerId)
        {
            // Lấy từ orders + consultations của đại lý
            var fromOrders = await _context.Orders
                .Where(o => o.DaiLyId == dealerId)
                .Include(o => o.NguoiDung)
                .Select(o => new CustomerDto
                {
                    UserId = o.NguoiDungId,
                    HoTen = o.NguoiDung.HoTen,
                    SoDienThoai = o.NguoiDung.SoDienThoai,
                    Email = o.NguoiDung.Email
                })
                .Distinct()
                .ToListAsync();

            return fromOrders;
        }

        public async Task<CustomerDetailDto> GetCustomerDetailAsync(long customerId)
        {
            var user = await _context.Users
                .Include(u => u.Orders)
                .Include(u => u.Consultations)
                .FirstOrDefaultAsync(u => u.Id == customerId);

            if (user == null)
                throw new Exception("Khách hàng không tồn tại");

            return new CustomerDetailDto
            {
                UserId = user.Id,
                HoTen = user.HoTen,
                SoDienThoai = user.SoDienThoai,
                Email = user.Email,
                SoDonHang = user.Orders.Count,
                SoLanTuVan = user.Consultations.Count,
                LanCuoiTuVan = user.Consultations.Max(c => c.ThoiGianTao),
                LanCuoiDatHang = user.Orders.Max(o => o.ThoiGianTao),
                GhiChu = new List<string>() // bạn có thể mở rộng thêm bảng Note sau
            };
        }
    }
}
