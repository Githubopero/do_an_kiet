namespace Web_ban_xe_VinFast.DTOs.Dealer
{
    public class InventoryDto
    {
        public long Id { get; set; }
        public string MauXe { get; set; } = string.Empty;
        public string CauHinhXe { get; set; } = string.Empty;
        public int SoLuongTonKho { get; set; }
        public bool CanhBaoTonThap { get; set; }
    }
}
