using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class InventoryService : IInventoryService
    {
        private readonly VinFastDbContext _context;

        public InventoryService(VinFastDbContext context) => _context = context;

        public async Task<List<InventoryDto>> GetInventoryAsync(long dealerId)
        {
            return await _context.DealerInventories
                .Include(di => di.Xe)
                .Include(di => di.PhienBan)
                .Where(di => di.DaiLyId == dealerId)
                .Select(di => new InventoryDto
                {
                    Id = di.Id,
                    TenXe = di.Xe.MauXe,
                    TenPhienBan = di.PhienBan.TenPhienBan, // Ví dụ: "Nâng cao", "Cao cấp"
                    SoLuongTonKho = di.SoLuongTonKho,
                    SoLuongTamGiu = di.SoLuongTamGiu,
                    CanhBaoTonThap = di.SoLuongTonKho <= (di.NguongCanhBaoTonThap ?? 5)
                })
                .ToListAsync();
        }
        // Nhập hoặc xuất kho vật lý (Cho nút bấm trên giao diện Quản lý kho)
        public async Task UpdateStockAsync(long inventoryId, int change)
        {
            var inventory = await _context.DealerInventories.FindAsync(inventoryId);
            if (inventory == null) throw new Exception("Không tìm thấy dữ liệu kho");

            inventory.SoLuongTonKho += change;

            // Tránh số âm
            if (inventory.SoLuongTonKho < 0) inventory.SoLuongTonKho = 0;

            await _context.SaveChangesAsync();
        }
        public async Task UpdateQuantityAsync(long inventoryId, int change)
        {
            var inventory = await _context.DealerInventories.FindAsync(inventoryId);
            if (inventory == null) throw new Exception("Không tìm thấy tồn kho");

            inventory.SoLuongTonKho += change;
            if (inventory.SoLuongTonKho < 0) throw new Exception("Số lượng không hợp lệ");

            await _context.SaveChangesAsync();
        }
    }
}