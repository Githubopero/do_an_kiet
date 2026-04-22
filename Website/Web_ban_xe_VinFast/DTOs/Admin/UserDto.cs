namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class UserDto
    {
        public long Id { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string VaiTro { get; set; } = string.Empty;
        public string TrangThaiTaiKhoan { get; set; } = string.Empty;
        public string SoDienThoai { get; set; }
    }
}
