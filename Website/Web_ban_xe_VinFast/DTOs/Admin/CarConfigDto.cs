namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class CarConfigDto
    {
        public long Id { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public string TenPhienBan { get; set; } = string.Empty;
        public string MauNgoaiThat { get; set; } = string.Empty;
        public string MauNoiThat { get; set; } = string.Empty;
        public string LoaiPin { get; set; } = string.Empty;
        public string LoaiNoiThat { get; set; } = string.Empty;
        public decimal TongGia { get; set; }
    }
}
