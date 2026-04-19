namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class CreateCarConfigRequest
    {
        public long XeId { get; set; }
        public long PhienBanId { get; set; }
        public string MauNgoaiThat { get; set; } = string.Empty;
        public string MauNoiThat { get; set; } = string.Empty;
        public string LoaiPin { get; set; } = string.Empty;
        public string LoaiNoiThat { get; set; } = string.Empty;
        public decimal TongGia { get; set; }
    }
}
