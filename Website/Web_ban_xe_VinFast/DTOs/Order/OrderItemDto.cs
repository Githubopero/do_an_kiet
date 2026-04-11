namespace Web_ban_xe_VinFast.DTOs.Order
{
    public class OrderItemDto
    {
        public long XeId { get; set; }
        public string CauHinhXe { get; set; } = string.Empty;
        public decimal Gia { get; set; }
    }
}
