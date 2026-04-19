using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;


namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class AdminDashboardService:IAdminDashboardService
    {
        private readonly VinFastDbContext _context;

        public AdminDashboardService(VinFastDbContext context) => _context = context;

        public async Task<DashboardDto> GetDashboardDataAsync(string? filter)
        {
            var orders = await _context.Orders.ToListAsync();

            return new DashboardDto
            {
                TotalRevenue = orders.Sum(o => o.TongTien),
                TotalOrders = orders.Count,
                PendingOrders = orders.Count(o => o.TrangThaiDonHang == "Pending"),
                TopSellingCars = await GetTopSellingCars()
            };
        }

        private async Task<List<TopCarDto>> GetTopSellingCars()
        {
            return await _context.OrderItems
                .Include(oi => oi.Xe)                    // ← Thêm Include để tránh null
                .Where(oi => oi.Xe != null)
                .GroupBy(oi => oi.Xe.MauXe)
                .Select(g => new TopCarDto
                {
                    MauXe = g.Key,
                    SoLuongBan = g.Sum(oi => oi.SoLuong ?? 1)
                })
                .OrderByDescending(x => x.SoLuongBan)
                .Take(5)
                .ToListAsync();
        }

        public async Task<byte[]> ExportOrdersToExcelAsync()
        {
            // Sử dụng EPPlus hoặc ClosedXML (bạn install package ClosedXML)
            // Code export Excel đơn giản (có thể mở rộng)
            // Trả về byte[] file Excel
            throw new NotImplementedException("Implement export Excel bằng ClosedXML hoặc EPPlus");
        }
    }
}
