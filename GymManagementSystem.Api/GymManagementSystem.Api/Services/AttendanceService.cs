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
            // Verificăm dacă are abonament activ
            var hasActiveSub = await _context.Subscriptions
                .AnyAsync(s => s.MemberId == memberId && s.IsActive && s.EndDate >= DateTime.Now);

            if (!hasActiveSub)
                throw new Exception("Acces respins! Membrul nu are un abonament activ.");

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
    }
}