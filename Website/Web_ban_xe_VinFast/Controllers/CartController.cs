using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.Helpers;
using System.Text.Json;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly ICarService _carService; // 1. Khai báo thêm biến này

        public CartController(ICartService cartService, ICarService carService)
        {
            _cartService = cartService;
            _carService = carService; // 3. Gán giá trị vào biến private
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest req)
        {
            try
            {
                // Kiểm tra xem ID người dùng có lấy được không
                var userId = User.GetUserId();
                if (userId <= 0) return Unauthorized(new { message = "Vui lòng đăng nhập" });

                var message = await _cartService.AddToCartAsync(userId, req);
                return Ok(new { success = true, message });
            }
            catch (Exception ex)
            {
                // Trả về ex.Message để bạn thấy lỗi thật sự ở Tab Console/Network của trình duyệt
                return BadRequest(new { success = false, message = "Lỗi xử lý: " + ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.GetUserId();
                if (userId <= 0)
                    return Unauthorized(new { message = "Vui lòng đăng nhập lại" });

                var cart = await _cartService.GetCartAsync(userId);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR Cart] {ex.Message}");
                return StatusCode(500, new { message = "Không thể tải giỏ hàng" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(long id)
        {
            await _cartService.RemoveItemAsync(User.GetUserId(), id);
            return Ok(new { success = true, message = "Đã xóa khỏi giỏ hàng" });
        }
    }
}