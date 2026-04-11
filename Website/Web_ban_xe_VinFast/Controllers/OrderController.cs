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

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
            => Ok(await _orderService.CreateOrderFromCartAsync(User.GetUserId(), req));

        [HttpPost("customer-info")]
        public async Task<IActionResult> SaveCustomerInfo([FromBody] CustomerInfoRequest req)
            => Ok(await _orderService.SaveCustomerInfoAsync(User.GetUserId(), req));

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
            => Ok(await _orderService.GetMyOrdersAsync(User.GetUserId()));
    }
}