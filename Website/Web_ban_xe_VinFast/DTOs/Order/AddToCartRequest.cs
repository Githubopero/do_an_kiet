namespace Web_ban_xe_VinFast.DTOs.Order
{
    public class AddToCartRequest
    {
        public long XeId { get; set; }
        public string CauHinhXeJson { get; set; } = string.Empty; // JSON từ React
        public decimal Gia { get; set; }
    }
}
