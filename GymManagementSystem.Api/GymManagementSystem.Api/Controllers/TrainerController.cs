using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainerController : ControllerBase
    {
        private readonly TrainerService _trainerService;
        public TrainerController(TrainerService trainerService) { _trainerService = trainerService; }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trainers = await _trainerService.GetAllWithMembersAsync();
            return Ok(trainers);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Trainer trainer) => Ok(await _trainerService.AddAsync(trainer));

        [HttpPost("assign")]
        public async Task<IActionResult> Assign(int memberId, int trainerId)
        {
            await _trainerService.AssignMemberToTrainerAsync(memberId, trainerId);
            return Ok("Membru asigurat antrenorului cu succes!");
        }
    }
}