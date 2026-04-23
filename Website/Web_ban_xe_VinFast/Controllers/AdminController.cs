using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.DTOs.CarImage;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Implementations;
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
        private readonly ICarConfigService _carConfigService;
        private readonly IOptionService _optionService;
        private readonly ICarImageService _imageService;

        public AdminController(
            ICarService carService,
            IUserManagementService userService,
            IAdminDashboardService dashboardService,
            ICarConfigService carConfigService,// ← Thêm vào constructor
            IOptionService optionService,
            ICarImageService imageService) // Thêm vào đây
        {
            _carService = carService;
            _userService = userService;
            _dashboardService = dashboardService;
            _carConfigService = carConfigService;   // ← Gán giá trị
            _optionService = optionService; // Gán giá trị
            _imageService = imageService;
        }
        //quản lý xe admin
        [HttpGet("cars")]
        public async Task<IActionResult> GetAllCars()
            => Ok(await _carService.GetAllCarsAdminAsync());

        [HttpPost("cars")]
        public async Task<IActionResult> CreateCar([FromBody] CreateCarRequest req)
        {
            await _carService.CreateCarAsync(req);
            return Ok(new { success = true, message = "Tạo xe thành công" });
        }
        // 1. Cập nhật thông tin xe (Tên và Mô tả)
        [HttpPut("cars/{id}")]
        public async Task<IActionResult> UpdateCar(long id, [FromBody] UpdateCarRequest req)
        {
            await _carService.UpdateCarAsync(id, req);
            return Ok(new { success = true, message = "Cập nhật xe thành công" });
        }

        // 2. Cập nhật trạng thái xe (Dòng này sửa lỗi 404 của bạn)
        [HttpPut("cars/{id}/status")]
        public async Task<IActionResult> UpdateCarStatus(long id, [FromBody] Dictionary<string, string> body)
        {
            // Lấy status từ body json { "status": "active" }
            if (body.TryGetValue("status", out var status))
            {
                await _carService.UpdateCarStatusAsync(id, status);
                return Ok(new { success = true, message = "Cập nhật trạng thái thành công" });
            }
            return BadRequest("Trạng thái không hợp lệ");
        }

        // 3. Xóa xe
        [HttpDelete("cars/{id}")]
        public async Task<IActionResult> DeleteCar(long id)
        {
            await _carService.DeleteCarAsync(id);
            return Ok(new { success = true, message = "Xóa xe thành công" });
        }
        //quản lý người dùng admin
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
            => Ok(await _userService.GetAllUsersAsync());

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateRole(long id, [FromBody] string role)
        {
            await _userService.UpdateRoleAsync(id, role);   // ← Sửa ở đây
            return Ok(new { success = true, message = "Cập nhật vai trò thành công" });
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateStatus(long id, [FromBody] string status)
        {
            await _userService.UpdateStatusAsync(id, status);
            return Ok(new { success = true, message = "Cập nhật trạng thái thành công" });
        }

        // 1. Thêm người dùng
        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest req)
        {
            await _userService.CreateUserAsync(req);
            return Ok(new { success = true, message = "Thêm người dùng thành công" });
        }

        // 2. Xóa người dùng
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            await _userService.DeleteUserAsync(id);
            return Ok(new { success = true, message = "Xóa người dùng thành công" });
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] UpdateUserRequest req)
        {
            await _userService.UpdateUserAsync(id, req);
            return Ok(new { success = true, message = "Cập nhật thành công" });
        }

        //dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard([FromQuery] string? filter = null)  // ← Thêm ? và giá trị mặc định
            => Ok(await _dashboardService.GetDashboardDataAsync(filter));

        [HttpGet("orders/export")]
        public async Task<IActionResult> ExportOrders()
        {
            var file = await _dashboardService.ExportOrdersToExcelAsync();
            return File(file, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "DonHang.xlsx");
        }




        //quản lý phiên bản admin

        // 1. Lấy TẤT CẢ phiên bản của toàn bộ các xe (Endpoint mới cho React)
        [HttpGet("versions/all")]
        public async Task<IActionResult> GetAllVersions()
        {
            var versions = await _carService.GetAllVersionsAdminAsync();
            return Ok(versions);
        }

        // 2. Lấy danh sách phiên bản của một xe cụ thể (Đã có của bạn)
        [HttpGet("cars/{carId}/versions")]
        public async Task<IActionResult> GetCarVersions(long carId)
        {
            var versions = await _carService.GetVersionsByCarIdAsync(carId);
            return Ok(versions);
        }

        // 3. Tạo phiên bản mới cho một xe (Đã có của bạn)
        [HttpPost("cars/{carId}/versions")]
        public async Task<IActionResult> CreateCarVersion(long carId, [FromBody] CarVersionDto req)
        {
            await _carService.CreateVersionAsync(carId, req);
            return Ok(new { success = true, message = "Thêm phiên bản xe thành công" });
        }

        // 4. Cập nhật phiên bản (Endpoint mới)
        [HttpPut("versions/{id}")]
        public async Task<IActionResult> UpdateCarVersion(long id, [FromBody] CarVersionDto req)
        {
            await _carService.UpdateVersionAsync(id, req);
            return Ok(new { success = true, message = "Cập nhật phiên bản thành công" });
        }

        // 5. Xóa (Xóa mềm) phiên bản (Endpoint mới)
        [HttpDelete("versions/{id}")]
        public async Task<IActionResult> DeleteCarVersion(long id)
        {
            await _carService.DeleteVersionAsync(id);
            return Ok(new { success = true, message = "Xóa phiên bản thành công" });
        }

        // --- QUẢN LÝ TÙY CHỌN (OPTIONS) ---

        [HttpGet("options")]
        public async Task<IActionResult> GetAllOptions()
            => Ok(await _optionService.GetAllOptionsAsync());

        [HttpGet("cars/{carId}/options")]
        public async Task<IActionResult> GetOptionsByCar(long carId)
            => Ok(await _optionService.GetOptionsByCarIdAsync(carId));

        [HttpPost("options")]
        public async Task<IActionResult> CreateOption([FromBody] CreateOptionRequest req)
        {
            await _optionService.CreateOptionAsync(req);
            return Ok(new { success = true, message = "Thêm tùy chọn thành công" });
        }

        [HttpPut("options/{id}")]
        public async Task<IActionResult> UpdateOption(long id, [FromBody] CreateOptionRequest req)
        {
            await _optionService.UpdateOptionAsync(id, req);
            return Ok(new { success = true, message = "Cập nhật tùy chọn thành công" });
        }

        [HttpDelete("options/{id}")]
        public async Task<IActionResult> DeleteOption(long id)
        {
            await _optionService.DeleteOptionAsync(id);
            return Ok(new { success = true, message = "Xóa tùy chọn thành công" });
        }



        //quản lý cấu hình xe admin
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

        // --- Endpoint cập nhật cấu hình xe ---
        [HttpPut("car-configs/{id}")]
        public async Task<IActionResult> UpdateConfig(long id, [FromBody] UpdateCarConfigRequest req)
        {
            try
            {
                await _carConfigService.UpdateConfigAsync(id, req);
                return Ok(new { success = true, message = "Cập nhật cấu hình thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }




        // --- QUẢN LÝ HÌNH ẢNH XE ---

        [HttpGet("car-images")]
        public async Task<IActionResult> GetAllImages()
            => Ok(await _imageService.GetAllImagesAsync());

        [HttpGet("cars/{carId}/images")]
        public async Task<IActionResult> GetImagesByCar(long carId)
            => Ok(await _imageService.GetImagesByCarIdAsync(carId));

        [HttpPost("car-images")]
        public async Task<IActionResult> UploadImage([FromForm] UploadCarImageRequest req)
        {
            var result = await _imageService.AddImageAsync(req);
            return Ok(new { success = true, data = result, message = "Tải ảnh lên thành công" });
        }

        [HttpPut("car-images/{id}")]
        public async Task<IActionResult> UpdateImage(long id, [FromForm] UploadCarImageRequest req)
        {
            await _imageService.UpdateImageAsync(id, req);
            return Ok(new { success = true, message = "Cập nhật ảnh thành công" });
        }

        [HttpDelete("car-images/{id}")]
        public async Task<IActionResult> DeleteImage(long id)
        {
            await _imageService.DeleteImageAsync(id);
            return Ok(new { success = true, message = "Xóa ảnh thành công" });
        }

    }
}