namespace Web_ban_xe_VinFast.DTOs.Consultation
{
    public class ConsultationRequest
    {
        public string HoTen { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MauXeQuanTam { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string MucDoUuTien { get; set; } = "NORMAL"; // HIGH hoặc NORMAL

        public string? AnhDinhKem { get; set; }

        // Thêm dòng này vào để Service có thể đọc được dữ liệu
        public int? NguoiDungId { get; set; }
    }
}
