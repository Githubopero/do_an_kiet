using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [ApiController]
    [Route("api/cars")]
    public class CarController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _carService.GetAllCarsAsync());

        [HttpGet("filter")]
        public async Task<IActionResult> Filter([FromQuery] CarFilterParams param)
            => Ok(await _carService.FilterCarsAsync(param));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(long id)
            => Ok(await _carService.GetCarDetailAsync(id));

        [HttpPost("config/calculate")]
        public async Task<IActionResult> CalculatePrice([FromBody] ConfigPriceRequest req)
        {
            try
            {
                var result = await _carService.CalculatePriceAsync(req);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });   // Trả về 400 thay vì 500
            }
        }
    }
}