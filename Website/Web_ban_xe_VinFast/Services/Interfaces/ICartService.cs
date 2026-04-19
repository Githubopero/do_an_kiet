using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICartService
    {
        Task<string> AddToCartAsync(long userId, AddToCartRequest req);
        Task<List<CartItemDto>> GetCartAsync(long userId);
        Task RemoveItemAsync(long userId, long cartItemId);
    }
}
