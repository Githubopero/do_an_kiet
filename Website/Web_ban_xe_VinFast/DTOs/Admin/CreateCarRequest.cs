namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class CreateCarRequest
    {
        public string MauXe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string TrangThaiHoatDong { get; set; } = "active";
    }
}
