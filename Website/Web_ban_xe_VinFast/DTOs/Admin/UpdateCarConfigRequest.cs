namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class UpdateCarConfigRequest
    {
        public long PhienBanId { get; set; } // Thêm dòng này
        public string MauNgoaiThat { get; set; } = string.Empty;
        public string MauNoiThat { get; set; } = string.Empty;
        public string LoaiPin { get; set; } = string.Empty;
        public string LoaiNoiThat { get; set; } = string.Empty;
        public decimal TongGia { get; set; }
    }
}
