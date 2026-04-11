using Web_ban_xe_VinFast.DTOs.Admin;
namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task CreateUserAsync(CreateUserRequest request);
        Task UpdateRoleAsync(long userId, string role);
        Task UpdateStatusAsync(long userId, string status);
    }
}
