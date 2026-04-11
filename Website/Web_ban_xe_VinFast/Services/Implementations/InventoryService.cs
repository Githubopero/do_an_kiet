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
                .Where(di => di.DaiLyId == dealerId)
                .Select(di => new InventoryDto
                {
                    Id = di.Id,
                    MauXe = di.Xe.MauXe,
                    CauHinhXe = di.CauHinhXe,
                    SoLuongTonKho = di.SoLuongTonKho,
                    CanhBaoTonThap = di.SoLuongTonKho <= (di.NguongCanhBaoTonThap ?? 5)
                })
                .ToListAsync();
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