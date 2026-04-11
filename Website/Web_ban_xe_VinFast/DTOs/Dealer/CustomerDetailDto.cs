namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class CustomerDetailDto
    {
        public long UserId { get; set; }

        public string HoTen { get; set; } = string.Empty;

        public string SoDienThoai { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? DiaChi { get; set; }   // có thể null vì không bắt buộc

        // Lịch sử tương tác (theo sequence diagram)
        public int SoDonHang { get; set; } = 0;

        public int SoLanTuVan { get; set; } = 0;

        public DateTime? LanCuoiTuVan { get; set; }

        public DateTime? LanCuoiDatHang { get; set; }

        public List<string> GhiChu { get; set; } = new List<string>();   // danh sách ghi chú của DealerStaff
    }
}
