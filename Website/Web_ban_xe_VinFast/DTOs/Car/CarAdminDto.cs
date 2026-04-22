namespace Web_ban_xe_VinFast.DTOs.Car
{
    public class CarAdminDto
    {
        public long Id { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string TrangThaiHoatDong { get; set; } = "active";
    }
    public class UpdateCarRequest
    {
        public string MauXe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
    }
}
