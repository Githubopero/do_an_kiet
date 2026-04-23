using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Consultation;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [ApiController]
    [Route("api/consultations")]
    public class CustomerConsultationController : ControllerBase
    {
        private readonly IConsultationService _consultationService;

        public CustomerConsultationController(IConsultationService consultationService)
        {
            _consultationService = consultationService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ConsultationRequest req)
        {
            // Lấy UserId từ NameIdentifier trong Token
    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    int? userId = userIdClaim != null ? int.Parse(userIdClaim.Value) : null;

    // Truyền userId này vào Service
    var result = await _consultationService.CreateConsultationAsync(req, userId);
            return Ok(result);
        }



        [HttpGet("my-requests")]
        [Authorize]
        public async Task<IActionResult> GetMyConsultations()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);
            var list = await _consultationService.GetUserConsultationsAsync(userId);
            return Ok(list);
        }
    }




}
