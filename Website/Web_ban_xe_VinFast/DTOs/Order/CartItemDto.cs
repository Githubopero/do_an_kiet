namespace Web_ban_xe_VinFast.DTOs.Order
{
    public class CartItemDto
    {
        public long Id { get; set; }
        public long XeId { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public string DuongDanHinhAnh { get; set; } = string.Empty;   // Ảnh chính

        public string PhienBan { get; set; } = string.Empty;
        public string MauNgoaiThat { get; set; } = string.Empty;
        public string MauNoiThat { get; set; } = string.Empty;
        public string LoaiPin { get; set; } = string.Empty;
        public string LoaiNoiThat { get; set; } = string.Empty;

        public decimal Gia { get; set; }
        public int? SoLuong { get; set; }
    }
}
