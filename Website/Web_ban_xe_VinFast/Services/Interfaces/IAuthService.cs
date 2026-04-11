using Web_ban_xe_VinFast.DTOs.Auth;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }
}
