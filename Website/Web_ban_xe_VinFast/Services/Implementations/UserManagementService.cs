using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class UserManagementService : IUserManagementService
    {
        private readonly VinFastDbContext _context;

        public UserManagementService(VinFastDbContext context) => _context = context;

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    HoTen = u.HoTen,
                    Email = u.Email,
                    VaiTro = u.VaiTro,
                    TrangThaiTaiKhoan = u.TrangThaiTaiKhoan
                })
                .ToListAsync();
        }

        public async Task CreateUserAsync(CreateUserRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email || u.SoDienThoai == request.SoDienThoai))
                throw new Exception("Email hoặc SĐT đã tồn tại");

            var user = new User
            {
                HoTen = request.HoTen,
                Email = request.Email,
                SoDienThoai = request.SoDienThoai,
                MatKhauHash = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
                VaiTro = request.VaiTro,
                TrangThaiTaiKhoan = "ACTIVE",
                ThoiGianKhoaTaiKhoan = DateTime.UtcNow,
                ThoiGianTao = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRoleAsync(long userId, string role)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User không tồn tại");
            user.VaiTro = role;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStatusAsync(long userId, string status)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User không tồn tại");
            user.TrangThaiTaiKhoan = status;
            await _context.SaveChangesAsync();
        }
    }
}