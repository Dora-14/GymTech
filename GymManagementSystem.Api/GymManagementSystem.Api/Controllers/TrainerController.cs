using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    public record AssignRequest(int MemberId, int TrainerId);

    [ApiController]
    [Route("api/[controller]")]
    public class TrainerController : ControllerBase
    {
        private readonly TrainerService _trainerService;
        public TrainerController(TrainerService trainerService) { _trainerService = trainerService; }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _trainerService.GetAllWithMembersAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var trainer = await _trainerService.GetByIdAsync(id);
            if (trainer == null) return NotFound(new { message = $"Trainer with ID {id} not found." });
            return Ok(trainer);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Trainer trainer) => Ok(await _trainerService.AddAsync(trainer));

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Trainer trainerUpdate)
        {
            var updated = await _trainerService.UpdateAsync(id, trainerUpdate);
            if (updated == null) return NotFound(new { message = $"Trainer with ID {id} not found." });
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _trainerService.DeleteAsync(id);
            if (!deleted) return NotFound(new { message = $"Trainer with ID {id} not found." });
            return NoContent();
        }

        [HttpGet("{id}/members")]
        public async Task<IActionResult> GetMembers(int id)
        {
            var members = await _trainerService.GetMembersByTrainerAsync(id);
            return Ok(members);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignRequest request)
        {
            await _trainerService.AssignMemberToTrainerAsync(request.MemberId, request.TrainerId);
            return Ok(new { message = "Member assigned to trainer successfully!" });
        }
    }
}