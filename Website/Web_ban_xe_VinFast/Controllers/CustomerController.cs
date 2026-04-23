using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Customer;
using Web_ban_xe_VinFast.Helpers;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/customer")]
    public class CustomerController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IUserService _userService; // Để lấy thông tin cá nhân
        private readonly ICarService _carService;

        public CustomerController(IAppointmentService appointmentService, IUserService userService, ICarService carService)
        {
            _appointmentService = appointmentService;
            _userService = userService;
            _carService = carService;
        }
        //lịch hẹn (customer)
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
            => Ok(await _userService.GetProfileAsync(User.GetUserId()));

        [HttpPost("appointments")]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentCreateDto dto)
        {
            await _appointmentService.CreateAppointmentAsync(User.GetUserId(), dto);
            return Ok(new { message = "Đặt lịch hẹn thành công! Nhân viên sẽ sớm liên hệ xác nhận." });
        }

        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            var list = await _appointmentService.GetUserAppointmentsAsync(userId);
            return Ok(list);
        }


        //so sánh xe(customer)
        [AllowAnonymous] // Cho phép mọi người xem trang so sánh
        [HttpGet("compare-versions")]
        public async Task<IActionResult> GetVersionsForSelection()
        {
            return Ok(await _carService.GetAllVersionsForComparisonAsync());
        }

        [AllowAnonymous]
        [HttpGet("compare-details")]
        public async Task<IActionResult> GetCompareDetails([FromQuery] string ids)
        {
            if (string.IsNullOrEmpty(ids)) return BadRequest("Hãy chọn ít nhất một phiên bản để so sánh.");

            var listIds = ids.Split(',').Select(long.Parse).ToList();
            var result = await _carService.GetVersionsToCompareAsync(listIds);
            return Ok(result);
        }
    }
}
