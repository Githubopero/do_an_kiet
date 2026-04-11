namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class CreateUserRequest
    {
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
        public string VaiTro { get; set; } = "Customer";
    }
}
