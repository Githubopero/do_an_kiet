using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Helpers
{
    // Bạn thiếu dòng khai báo class này
    public static class JwtHelper
    {
        public static string GenerateJwtToken(User user, IConfiguration config)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.HoTen),
                new Claim(ClaimTypes.Role, user.VaiTro),
                // Cần lấy Id thực tế của Đại lý từ User nếu có
                new Claim("DealerId", user.VaiTro == "DealerStaff" ? "1" : "0")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"] ?? "supersecretkey1234567890"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}