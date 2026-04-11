namespace Web_ban_xe_VinFast.DTOs.Car
{
    public class CarVersionDto
    {
        public long Id { get; set; }
        public string TenPhienBan { get; set; } = string.Empty; 
        public decimal GiaCoBan { get; set; }
        public float DungLuongPin { get; set; }
        public int QuangDuongDiChuyen { get; set; }
    }
}
