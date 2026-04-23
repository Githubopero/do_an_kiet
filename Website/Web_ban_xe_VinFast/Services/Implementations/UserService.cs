using Web_ban_xe_VinFast.DTOs.Customer;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;


namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class UserService:IUserService
    {
        
        private readonly VinFastDbContext _context;

        public UserService(VinFastDbContext context)
        {
            _context = context;
        }

        public async Task<CustomerProfileDto> GetProfileAsync(long userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) throw new Exception("Không tìm thấy người dùng");

            return new CustomerProfileDto
            {
                HoTen = user.HoTen,
                SoDienThoai = user.SoDienThoai,
                Email = user.Email
            };
        }
    }
}
