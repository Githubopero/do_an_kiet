using Web_ban_xe_VinFast.DTOs.Customer;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IUserService
    {
        //lấy thông tin người dùng(customer)
        Task<CustomerProfileDto> GetProfileAsync(long userId);
    }
}
