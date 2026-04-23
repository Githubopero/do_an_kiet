using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Helpers;
using Web_ban_xe_VinFast.Services.Implementations;
using Web_ban_xe_VinFast.Services.Interfaces;

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
        private readonly IConsultationService _consultationService;
        private readonly IAppointmentService _appointmentService;

        public DealerController(
            IOrderService orderService,
            IInventoryService inventoryService,
            ICustomerService customerService,
            IConsultationService consultationService,
            IAppointmentService appointmentService)
        {
            _orderService = orderService;
            _inventoryService = inventoryService;
            _customerService = customerService;
            _consultationService = consultationService;
            _appointmentService = appointmentService;
        }
        //quản lý đơn hàng (dealer staff)
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
        //quản lý tồn kho(dealer staff)
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory()
            => Ok(await _inventoryService.GetInventoryAsync(User.GetDealerId()));
        //quản lý khách hàng(dealer staff)
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
            => Ok(await _customerService.GetCustomersByDealerAsync(User.GetDealerId()));


        //quản lý yêu cầu tư vấn(dealer staff)
        // Endpoint lấy danh sách tư vấn
        [HttpGet("consultations")]
        public async Task<IActionResult> GetConsultations()
            => Ok(await _consultationService.GetAllConsultationsAsync());

        // Endpoint cập nhật trạng thái & độ ưu tiên
        [HttpPut("consultations/{id}")]
        public async Task<IActionResult> UpdateConsultation(long id, [FromBody] UpdateConsultationRequest req)
        {
            await _consultationService.UpdateConsultationAsync(id, req);
            return Ok(new { message = "Cập nhật yêu cầu tư vấn thành công" });
        }

        // Endpoint xóa yêu cầu (nếu cần)
        [HttpDelete("consultations/{id}")]
        public async Task<IActionResult> DeleteConsultation(long id)
        {
            await _consultationService.DeleteConsultationAsync(id);
            return Ok(new { message = "Xóa thành công" });
        }




        //quản lý lịch hẹn (dealer staff)
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
            => Ok(await _appointmentService.GetDealerAppointmentsAsync(User.GetDealerId()));

        [HttpPut("appointments/{id}")]
        public async Task<IActionResult> UpdateAppointment(long id, [FromBody] UpdateAppointmentRequest req)
        {
            await _appointmentService.UpdateAppointmentAsync(id, req, User.GetDealerId());
            return Ok(new { message = "Cập nhật lịch hẹn thành công" });
        }
    }
}