using Web_ban_xe_VinFast.DTOs.Dealer;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IInventoryService
    {
        Task<List<InventoryDto>> GetInventoryAsync(long dealerId);
        Task UpdateQuantityAsync(long inventoryId, int change);
    }
}