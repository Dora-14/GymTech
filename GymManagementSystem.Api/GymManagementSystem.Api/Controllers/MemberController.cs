using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly MemberService _memberService;

        public MemberController(MemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Member>>> GetAll()
        {
            var members = await _memberService.GetAllAsync();
            return Ok(members);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            var member = await _memberService.GetByIdAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }

        [HttpPost]
        public async Task<ActionResult<Member>> Create(Member member)
        {
            var createdMember = await _memberService.AddAsync(member);
            return CreatedAtAction(nameof(GetMember), new { id = createdMember.MemberId }, createdMember);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _memberService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Member memberUpdate)
        {
            var updatedMember = await _memberService.UpdateAsync(id, memberUpdate);
            if (updatedMember == null) return NotFound(new { message = $"Member with ID {id} not found." });
            return Ok(updatedMember);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return BadRequest(new { message = "Query parameter is required." });
            var results = await _memberService.SearchAsync(query);
            return Ok(results);
        }
    }
}