using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.Helpers;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        //[HttpPost("checkout")]
        //public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
        //    => Ok(await _orderService.CreateOrderFromCartAsync(User.GetUserId(), req));
        // Đổi từ "checkout" thành "create-from-cart" để khớp với frontend
        [HttpPost("create-from-cart")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
            => Ok(await _orderService.CreateOrderFromCartAsync(User.GetUserId(), req));

        [HttpPost("customer-info")]
        public async Task<IActionResult> SaveCustomerInfo([FromBody] CustomerInfoRequest req)
            => Ok(await _orderService.SaveCustomerInfoAsync(User.GetUserId(), req));

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
            => Ok(await _orderService.GetMyOrdersAsync(User.GetUserId()));
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(long id)
        {
            // Bạn cần bổ sung hàm GetOrderByIdAsync vào IOrderService và OrderService
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng trên hệ thống." });
            return Ok(order);
        }


        //tích hợp thanh toán vnpay
        //[HttpPost("{id}/payment-url")]
        //public async Task<IActionResult> GetPaymentUrl(long id)
        //{
        //    // Tạo URL thanh toán cho đơn hàng
        //    var url = await _orderService.CreatePaymentUrl(id, HttpContext);
        //    return Ok(new { url });
        //}

        // Endpoint này không yêu cầu Authorize vì VNPAY Server sẽ gọi vào
        //[AllowAnonymous]
        //[HttpGet("vnpay-ipn")]
        //public async Task<IActionResult> VnpayIpn()
        //{
        //    var result = await _orderService.ProcessVnpayIpn(Request.Query);
        //    if (result) return Ok(new { RspCode = "00", Message = "Confirm Success" });
        //    return BadRequest(new { RspCode = "99", Message = "Invalid Signature" });
        //}
    }

}