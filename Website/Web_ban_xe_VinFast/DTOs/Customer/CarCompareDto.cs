namespace Web_ban_xe_VinFast.DTOs.Customer
{
    public class CarCompareDto
    {
        public long Id { get; set; }
        public string TenMauXe { get; set; } = null!; // Lấy từ table Car
        public string TenPhienBan { get; set; } = null!; // Lấy từ table CarVersion
        public decimal GiaCoBan { get; set; }
        public float DungLuongPin { get; set; }
        public int QuangDuongDiChuyen { get; set; }
        public int? SoChoNgoi { get; set; }
        public string? HinhAnh { get; set; } // Lấy ảnh 'main' từ table CarImage
    }
}
