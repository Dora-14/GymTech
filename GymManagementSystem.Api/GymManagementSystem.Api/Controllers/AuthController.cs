using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService) { _authService = authService; }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _authService.LogInAsync(username, password);
            if (user == null) return Unauthorized("Username sau parolă incorectă.");
            return Ok(new { message = "Login reușit!", user.Username, user.Role });
        }
    }
}