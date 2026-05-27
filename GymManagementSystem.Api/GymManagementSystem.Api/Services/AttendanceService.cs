using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class AttendanceService
    {
        private readonly AppDbContext _context;
        public AttendanceService(AppDbContext context) { _context = context; }

        public async Task<Attendance> CheckInAsync(int memberId)
        {
            var hasActiveSub = await _context.Subscriptions
                .AnyAsync(s => s.MemberId == memberId && s.IsActive && s.EndDate >= DateTime.Now);

            if (!hasActiveSub)
                throw new Exception("Access denied. Member does not have an active subscription.");

            var attendance = new Attendance
            {
                MemberId = memberId,
                Date = DateTime.Now,
                CheckInTime = DateTime.Now
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();
            return attendance;
        }

        public async Task<List<Attendance>> GetByMemberAsync(int memberId)
        {
            return await _context.Attendances
                .Where(a => a.MemberId == memberId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        public async Task<List<Attendance>> GetAllAsync()
        {
            return await _context.Attendances.OrderByDescending(a => a.Date).ToListAsync();
        }
    }
}