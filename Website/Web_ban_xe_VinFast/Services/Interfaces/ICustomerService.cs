using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<List<CustomerDto>> GetCustomersByDealerAsync(long dealerId);
        Task<CustomerDetailDto> GetCustomerDetailAsync(long customerId);
    }
}
