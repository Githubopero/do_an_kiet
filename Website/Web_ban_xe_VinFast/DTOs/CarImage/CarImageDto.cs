namespace Web_ban_xe_VinFast.DTOs.CarImage
{
    public class CarImageDto
    {
        public long Id { get; set; }
        public long XeId { get; set; }
        public string MauXe { get; set; } // Hiển thị tên xe cho dễ quản lý
        public string DuongDanHinhAnh { get; set; }
        public string LoaiAnh { get; set; }
        public short? ThuTuSapXep { get; set; }
    }
}
