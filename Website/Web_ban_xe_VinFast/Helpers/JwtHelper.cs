using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateJwtToken(User user, IConfiguration config)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.HoTen),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.VaiTro),
                new Claim("DealerId", user.VaiTro == "DealerStaff" ? "1" : "0") // Có thể cải tiến sau
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]
                ?? "SuperSecretKey123!@#SuperSecretKey123!@#")); // Phải dài ít nhất 32 ký tự

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"] ?? "VinFastAPI",
                audience: config["Jwt:Audience"] ?? "VinFastClient",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}