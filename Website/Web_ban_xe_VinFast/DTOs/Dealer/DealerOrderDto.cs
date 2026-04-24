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
        public long PhienBanId { get; set; } // Giữ lại để xử lý logic kho/hóa đơn
        public string TenPhienBan { get; set; } = string.Empty;// Để in ra chữ (Eco, Plus, Premium)
        public decimal GiaPhienBan { get; set; } // Thay cho GiaCoBan của Xe
        public List<OptionDisplayDto> ChiTietCauHinh { get; set; } = new();
        public decimal GiaCuoi { get; set; }
        public int SoLuong { get; set; }
    }
    public class OptionDisplayDto
    {
        public string Nhan { get; set; }      // Ví dụ: "Màu ngoại thất"
        public string GiaTri { get; set; }   // Ví dụ: "Trắng"
        public decimal GiaChenhLech { get; set; } // Lấy từ cột AnhHuongDenGia
    }
}
