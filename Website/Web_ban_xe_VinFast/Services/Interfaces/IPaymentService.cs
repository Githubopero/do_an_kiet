using Web_ban_xe_VinFast.DTOs.Payment;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, string clientIp);
        //Task<(bool Success, string Message)> ProcessReturnAsync(VnpayReturnDto returnDto);
        // Cập nhật dòng này: Thêm IQueryCollection để lấy dữ liệu gốc từ URL
        Task<(bool Success, string Message)> ProcessReturnAsync(VnpayReturnDto returnDto, IQueryCollection queryParameters);
        Task ProcessIpnAsync(VnpayReturnDto ipnDto);
    }
}
