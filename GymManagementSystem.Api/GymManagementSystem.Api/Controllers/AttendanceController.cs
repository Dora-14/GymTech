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
            return BadRequest(ex.Message);
        }
    }
}