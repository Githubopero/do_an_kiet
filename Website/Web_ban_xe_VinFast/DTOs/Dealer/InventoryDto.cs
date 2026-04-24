namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class InventoryDto
    {
        public long Id { get; set; }
        public string TenXe { get; set; } = string.Empty;
        public string TenPhienBan { get; set; } = string.Empty; // Thêm tên phiên bản
        public int SoLuongTonKho { get; set; }
        public int SoLuongTamGiu { get; set; } // Số lượng đang đợi bàn giao (đã cọc)
        public int SoLuongKhaDung => SoLuongTonKho - SoLuongTamGiu; // Số lượng khách có thể đặt mua
        public bool CanhBaoTonThap { get; set; }
    }
}
