using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly AttendanceService _attendanceService;
    public AttendanceController(AttendanceService attendanceService) { _attendanceService = attendanceService; }

    [HttpPost("checkin/{memberId}")]
    public async Task<IActionResult> CheckIn(int memberId)
    {
        try
        {
            var result = await _attendanceService.CheckInAsync(memberId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetByMember(int memberId)
    {
        var records = await _attendanceService.GetByMemberAsync(memberId);
        return Ok(records);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _attendanceService.GetAllAsync());
    }
}