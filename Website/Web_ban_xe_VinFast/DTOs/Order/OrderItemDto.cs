namespace Web_ban_xe_VinFast.DTOs.Order
{
    public class OrderItemDto
    {
        public long XeId { get; set; }
        public long PhienBanId { get; set; } // Thêm mới để định danh phiên bản
        public string CauHinhXe { get; set; } = string.Empty;
        public decimal Gia { get; set; }
        public int SoLuong { get; set; } // Thêm số lượng để đồng bộ
    }
}
