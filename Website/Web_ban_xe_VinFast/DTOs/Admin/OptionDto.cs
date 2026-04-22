namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class OptionDto
    {
        public long Id { get; set; }
        public long XeId { get; set; }
        public string TenXe { get; set; } = string.Empty; // Để hiển thị ở UI
        public string LoaiTuyChon { get; set; } = null!;
        public string TenTuyChon { get; set; } = null!;
        public decimal? AnhHuongDenGia { get; set; }
        public bool? TrangThaiKhaDung { get; set; }
    }
    public class CreateOptionRequest
    {
        public long XeId { get; set; }
        public string LoaiTuyChon { get; set; } = null!; // exterior_color, interior_color...
        public string TenTuyChon { get; set; } = null!; // Tên giá trị (ví dụ: "Trắng", "Pin thuê")
        public decimal AnhHuongDenGia { get; set; }
    }
}
