using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly ICarService _carService;
        private readonly IUserManagementService _userService;
        private readonly IAdminDashboardService _dashboardService;

        public AdminController(
            ICarService carService,
            IUserManagementService userService,
            IAdminDashboardService dashboardService)
        {
            _carService = carService;
            _userService = userService;
            _dashboardService = dashboardService;
        }

        [HttpGet("cars")]
        public async Task<IActionResult> GetAllCars()
            => Ok(await _carService.GetAllCarsAdminAsync());

        [HttpPost("cars")]
        public async Task<IActionResult> CreateCar([FromBody] CreateCarRequest req)
        {
            await _carService.CreateCarAsync(req);
            return Ok(new { success = true, message = "Tạo xe thành công" });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
            => Ok(await _userService.GetAllUsersAsync());

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateRole(long id, [FromBody] string role)
        {
            await _userService.UpdateRoleAsync(id, role);   // ← Sửa ở đây
            return Ok(new { success = true, message = "Cập nhật vai trò thành công" });
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard([FromQuery] string filter)
            => Ok(await _dashboardService.GetDashboardDataAsync(filter));

        [HttpGet("orders/export")]
        public async Task<IActionResult> ExportOrders()
        {
            var file = await _dashboardService.ExportOrdersToExcelAsync();
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "DonHang.xlsx");
        }
    }
}