namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class AppointmentDto
    {
        public long Id { get; set; }
        public long NguoiDungId { get; set; }
        public string HoTenKhachHang { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public DateTime NgayGioHen { get; set; }
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; } = null!;
    }
    public class UpdateAppointmentRequest
    {
        public DateTime NgayGioHen { get; set; }
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; } = null!;
    }
}
