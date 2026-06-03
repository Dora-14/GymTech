using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    public record LoginRequest(string Username, string Password);
    public record RegisterRequest(string FirstName, string LastName, string Email, string Phone, string Password);

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService) { _authService = authService; }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (user, memberId, trainerId) = await _authService.LogInAsync(request.Username, request.Password);
            if (user == null) return Unauthorized(new { message = "Invalid username or password." });
            return Ok(new { message = "Login successful!", user.Username, user.Role, user.UserId, memberId, trainerId });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var (account, member) = await _authService.RegisterAsync(
                    request.FirstName, request.LastName, request.Email, request.Phone, request.Password);
                return CreatedAtRoute(null, new
                {
                    message = "Account created successfully!",
                    account.Username,
                    account.Role,
                    member.MemberId
                });
            }
            catch (Exception ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }
}