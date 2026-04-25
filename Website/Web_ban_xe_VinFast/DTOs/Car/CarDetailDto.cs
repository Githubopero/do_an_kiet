using Web_ban_xe_VinFast.DTOs.Admin;

namespace Web_ban_xe_VinFast.DTOs.Car
{
    public class CarDetailDto
    {
        public long Id { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string DuongDanHinhAnhChinh { get; set; } // THÊM DÒNG NÀY
        public List<CarVersionDto> PhienBan { get; set; } = new();
        public List<CarImageDto> HinhAnh { get; set; } = new();
        public List<CarConfigurationDto> CauHinhCoSan { get; set; } = new();
        // THÊM DÒNG NÀY ĐỂ CHỨA DỮ LIỆU CHO DROPDOWN
        public List<OptionDto> Options { get; set; } = new();
    }
}
