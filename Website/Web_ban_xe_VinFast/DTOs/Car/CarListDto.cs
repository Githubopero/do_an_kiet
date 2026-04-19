namespace Web_ban_xe_VinFast.DTOs.Car
{
    public class CarListDto
    {
        public long Id { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public decimal GiaThapNhat { get; set; }
        public string DuongDanHinhAnhChinh { get; set; } = string.Empty;


        // THÊM DÒNG NÀY ĐỂ HẾT LỖI
        public string TrangThaiHoatDong { get; set; } = string.Empty;
    }
}
