namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class DealerOrderDto
    {
        public long Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TongTien { get; set; }
        public DateTime ThoiGianTao { get; set; }
    }
}
