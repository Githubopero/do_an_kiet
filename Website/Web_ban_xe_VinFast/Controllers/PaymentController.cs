using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Payment;
using Web_ban_xe_VinFast.Helpers;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : Controller
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            var clientIp = Utils.GetIpAddress(HttpContext);
            var result = await _paymentService.CreatePaymentAsync(request, clientIp);
            return Ok(result);
        }

        // Return URL - React sẽ gọi hoặc redirect đến trang riêng
        [HttpGet("return")]
        public async Task<IActionResult> VnpayReturn([FromQuery] VnpayReturnDto dto)
        {
            // Truyền thêm HttpContext.Request.Query vào service
            var (success, message) = await _paymentService.ProcessReturnAsync(dto, HttpContext.Request.Query);

            string status = success ? "true" : "false";
            string redirectUrl = $"http://localhost:5173/customer/payment-result?orderId={dto.vnp_TxnRef}&success={status}&message={Uri.EscapeDataString(message)}";

            return Redirect(redirectUrl);
        }
        //[HttpGet("return")]
        //public async Task<IActionResult> VnpayReturn([FromQuery] VnpayReturnDto dto)
        //{
        //    var (success, message) = await _paymentService.ProcessReturnAsync(dto);
        //    // Redirect về React với thông tin
        //    //return Redirect($"http://localhost:3000/payment-success?orderId={dto.vnp_TxnRef}&success={success}&message={Uri.EscapeDataString(message)}");
        //    // Sửa payment-success thành payment-result (hoặc ngược lại cho khớp với React Route)
        //    //return Redirect($"http://localhost:3000/customer/payment-result?orderId={dto.vnp_TxnRef}&success={success}&message={Uri.EscapeDataString(message)}");
        //    // Cần ép kiểu success về string viết thường (true/false) để React đọc được
        //    string status = success ? "true" : "false";
        //    string redirectUrl = $"http://localhost:5173/customer/payment-result?orderId={dto.vnp_TxnRef}&success={status}&message={Uri.EscapeDataString(message)}";

        //    return Redirect(redirectUrl);
        //}



        // IPN - VNPAY gọi ngầm
        [HttpPost("vnpay-ipn")]
        [HttpGet("vnpay-ipn")]   // VNPAY đôi khi dùng GET
        public async Task<IActionResult> VnpayIpn([FromQuery] VnpayReturnDto dto)
        {
            await _paymentService.ProcessIpnAsync(dto);
            return Ok(new { RspCode = "00", Message = "Confirm Success" });
        }
    }
}
