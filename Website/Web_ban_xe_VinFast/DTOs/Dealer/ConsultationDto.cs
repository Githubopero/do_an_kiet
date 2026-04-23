namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class ConsultationDto
    {
        public long Id { get; set; }
        public string HoTen { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string MauXeQuanTam { get; set; } = null!;
        public string NoiDung { get; set; } = null!;
        public string MucDoUuTien { get; set; } = null!;
        public string TrangThaiXyLy { get; set; } = null!;
        public string MaTracking { get; set; } = null!;
        public string AnhDinhKem { get; set; } = null!;
        //public DateTime? ThoiGianTao { get; set; }
    }
    public class UpdateConsultationRequest
    {
        public string? MucDoUuTien { get; set; } // 'NORMAL','HIGH'
        public string? TrangThaiXyLy { get; set; } // 'New','InProgress','Resolved'
    }
}
