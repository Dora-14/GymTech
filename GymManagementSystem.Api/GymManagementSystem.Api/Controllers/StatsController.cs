using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly StatsService _statsService;
        public StatsController(StatsService statsService) { _statsService = statsService; }

        [HttpGet]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _statsService.GetStatsAsync();
            return Ok(stats);
        }
    }
}
