namespace Web_ban_xe_VinFast.DTOs.Payment
{
    public class CreatePaymentRequest
    {
        public long OrderId { get; set; }
        public string? BankCode { get; set; } // mặc định hoặc để frontend chọn
        public string Locale { get; set; } = "vn";
    }
}
