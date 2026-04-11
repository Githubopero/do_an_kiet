using Microsoft.AspNetCore.Mvc;
using Web_ban_xe_VinFast.DTOs.Auth;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}