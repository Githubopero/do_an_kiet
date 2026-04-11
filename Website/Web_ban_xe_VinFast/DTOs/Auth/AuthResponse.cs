namespace Web_ban_xe_VinFast.DTOs.Auth
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public long UserId { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string VaiTro { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}
