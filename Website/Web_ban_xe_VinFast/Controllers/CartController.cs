using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.Helpers;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest req)
        {
            var message = await _cartService.AddToCartAsync(User.GetUserId(), req);
            return Ok(new { success = true, message });
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
            => Ok(await _cartService.GetCartAsync(User.GetUserId()));

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(long id)
        {
            await _cartService.RemoveItemAsync(User.GetUserId(), id);
            return Ok(new { success = true, message = "Đã xóa khỏi giỏ hàng" });
        }
    }
}