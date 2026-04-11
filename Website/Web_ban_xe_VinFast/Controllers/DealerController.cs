using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.Helpers;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "DealerStaff")]
    [ApiController]
    [Route("api/dealer")]
    public class DealerController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IInventoryService _inventoryService;
        private readonly ICustomerService _customerService;

        public DealerController(
            IOrderService orderService,
            IInventoryService inventoryService,
            ICustomerService customerService)
        {
            _orderService = orderService;
            _inventoryService = inventoryService;
            _customerService = customerService;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string? status)
            => Ok(await _orderService.GetDealerOrdersAsync(User.GetDealerId(), status));

        [HttpPost("orders/{id}/confirm")]
        public async Task<IActionResult> ConfirmOrder(long id)
        {
            await _orderService.ConfirmOrderAsync(id, User.GetDealerId());
            return Ok(new { message = "Xác nhận đơn hàng thành công" });
        }

        [HttpPost("orders/{id}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateStatusRequest req)
        {
            await _orderService.UpdateOrderStatusAsync(id, req, User.GetDealerId());
            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory()
            => Ok(await _inventoryService.GetInventoryAsync(User.GetDealerId()));

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
            => Ok(await _customerService.GetCustomersByDealerAsync(User.GetDealerId()));
    }
}