using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Implementations;
using Web_ban_xe_VinFast.Services.Interfaces;
using Web_ban_xe_VinFast.DTOs.Car;

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
        private readonly ICarConfigService _carConfigService;   // ← Khai báo field

        public AdminController(
            ICarService carService,
            IUserManagementService userService,
            IAdminDashboardService dashboardService,
            ICarConfigService carConfigService)   // ← Thêm vào constructor
        {
            _carService = carService;
            _userService = userService;
            _dashboardService = dashboardService;
            _carConfigService = carConfigService;   // ← Gán giá trị
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
        public async Task<IActionResult> Dashboard([FromQuery] string? filter = null)  // ← Thêm ? và giá trị mặc định
            => Ok(await _dashboardService.GetDashboardDataAsync(filter));

        [HttpGet("orders/export")]
        public async Task<IActionResult> ExportOrders()
        {
            var file = await _dashboardService.ExportOrdersToExcelAsync();
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "DonHang.xlsx");
        }





        // 1. Lấy danh sách phiên bản của một xe cụ thể
        [HttpGet("cars/{carId}/versions")]
        public async Task<IActionResult> GetCarVersions(long carId)
        {
            var versions = await _carService.GetVersionsByCarIdAsync(carId);
            return Ok(versions);
        }

        // 2. Tạo phiên bản mới cho một xe
        [HttpPost("cars/{carId}/versions")]
        public async Task<IActionResult> CreateCarVersion(long carId, [FromBody] CarVersionDto req)
        {
            await _carService.CreateVersionAsync(carId, req);
            return Ok(new { success = true, message = "Thêm phiên bản xe thành công" });
        }



        // Lấy toàn bộ danh sách cấu hình
        [HttpGet("car-configs")]
        public async Task<IActionResult> GetAllConfigs()
            => Ok(await _carConfigService.GetAllConfigsAsync());

        // Tạo cấu hình mới
        [HttpPost("car-configs")]
        public async Task<IActionResult> CreateConfig([FromBody] CreateCarConfigRequest req)
        {
            await _carConfigService.CreateConfigAsync(req);
            return Ok(new { success = true, message = "Thêm cấu hình thành công" });
        }

        // Xóa cấu hình
        [HttpDelete("car-configs/{id}")]
        public async Task<IActionResult> DeleteConfig(long id)
        {
            await _carConfigService.DeleteConfigAsync(id);
            return Ok(new { success = true, message = "Xóa cấu hình thành công" });
        }

    }
}