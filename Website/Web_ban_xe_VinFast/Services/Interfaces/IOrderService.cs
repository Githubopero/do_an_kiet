using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.DTOs.Order;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderFromCartAsync(long userId, CheckoutRequest req);
        Task<bool> SaveCustomerInfoAsync(long userId, CustomerInfoRequest req);
        Task<List<OrderDto>> GetMyOrdersAsync(long userId);

        // DealerStaff
        Task<List<DealerOrderDto>> GetDealerOrdersAsync(long dealerId, string? status);
        Task ConfirmOrderAsync(long orderId, long dealerId);
        Task UpdateOrderStatusAsync(long orderId, UpdateStatusRequest req, long dealerId);
    }
}
