namespace Web_ban_xe_VinFast.DTOs.Car
{
    public class CarVersionDto
    {
        public long Id { get; set; }

        // ID của xe cha để dễ dàng quản lý/lọc ở Frontend
        public long XeId { get; set; }

        // Thêm tên mẫu xe để hiển thị ở bảng danh sách tổng quát
        public string MauXe { get; set; } = string.Empty;
        public string TenPhienBan { get; set; } = string.Empty; 
        public decimal GiaCoBan { get; set; }
        public float DungLuongPin { get; set; }
        public int QuangDuongDiChuyen { get; set; }
        // Thêm số chỗ ngồi theo yêu cầu của bạn
        public int SoChoNgoi { get; set; }
    }
}
