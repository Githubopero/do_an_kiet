namespace Web_ban_xe_VinFast.DTOs.Order
{
    public class OrderDto
    {
        public long Id { get; set; }
        public string TrangThaiDonHang { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public decimal SoTienDatCoc { get; set; }
        public DateTime ThoiGianTao { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
