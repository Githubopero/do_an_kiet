using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Web_ban_xe_VinFast.DTOs.Auth;
using Web_ban_xe_VinFast.Helpers;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly VinFastDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(VinFastDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.SoDienThoai == request.SoDienThoai))
                return new AuthResponse { Success = false, Message = "Email hoặc SĐT đã tồn tại" };

            var user = new User
            {
                HoTen = request.HoTen,
                Email = request.Email,
                SoDienThoai = request.SoDienThoai,
                MatKhauHash = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
                VaiTro = "Customer",
                TrangThaiTaiKhoan = "ACTIVE",
                ThoiGianKhoaTaiKhoan = DateTime.UtcNow,
                ThoiGianTao = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await GenerateAuthResponse(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.EmailOrPhone || u.SoDienThoai == request.EmailOrPhone);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.MatKhau, user.MatKhauHash))
            {
                if (user != null)
                {
                    user.SoLanNhapSai = (user.SoLanNhapSai ?? 0) + 1;
                    if (user.SoLanNhapSai >= 5)
                    {
                        user.TrangThaiTaiKhoan = "LOCKED";
                        user.ThoiGianKhoaTaiKhoan = DateTime.UtcNow.AddMinutes(5);
                    }
                    await _context.SaveChangesAsync();
                }
                return new AuthResponse { Success = false, Message = "Sai thông tin đăng nhập" };
            }

            if (user.TrangThaiTaiKhoan == "LOCKED")
                return new AuthResponse { Success = false, Message = "Tài khoản đang bị khóa do nhập mật khẩu sai quá 5 lần!" };

            user.SoLanNhapSai = 0;
            await _context.SaveChangesAsync();

            return await GenerateAuthResponse(user);
        }

        private async Task<AuthResponse> GenerateAuthResponse(User user)
        {
            var token = JwtHelper.GenerateJwtToken(user, _config);
            return new AuthResponse
            {
                Success = true,
                UserId = user.Id,
                HoTen = user.HoTen,

                // THÊM 2 DÒNG NÀY:
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,

                VaiTro = user.VaiTro,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
        }
    }
}