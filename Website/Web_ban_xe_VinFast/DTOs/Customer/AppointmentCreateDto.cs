namespace Web_ban_xe_VinFast.DTOs.Customer
{
    public class AppointmentCreateDto
    {
        public long DaiLyId { get; set; }
        public DateTime NgayGioHen { get; set; }
        public string? GhiChu { get; set; }
    }
    public class CustomerProfileDto
    {
        public string HoTen { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
