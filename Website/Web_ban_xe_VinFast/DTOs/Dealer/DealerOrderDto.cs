namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    //quản lý đơn hàng(dealer staff)
    public class DealerOrderDto
    {
        public long Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public decimal SoTienDatCoc { get; set; } // Thêm mới
        public DateTime ThoiGianTao { get; set; }
        public List<OrderDetailItemDto> Items { get; set; } = new(); // Thêm chi tiết
    }
    public class OrderDetailItemDto
    {
        public string TenXe { get; set; } = string.Empty;
        public string TenPhienBan { get; set; } = string.Empty;
        public string CauHinhXe { get; set; } = string.Empty; // Chứa màu, nội thất...
        public decimal Gia { get; set; }
        public int SoLuong { get; set; }
    }
}
