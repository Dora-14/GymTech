using GymManagementSystem.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class StatsService
    {
        private readonly AppDbContext _context;
        public StatsService(AppDbContext context) { _context = context; }

        public async Task<object> GetStatsAsync()
        {
            var totalMembers = await _context.Members.CountAsync();
            var totalTrainers = await _context.Trainers.CountAsync();
            var activeSubscriptions = await _context.Subscriptions
                .CountAsync(s => s.IsActive && s.EndDate >= DateTime.Now);
            var totalRevenue = await _context.Payments.SumAsync(p => (decimal?)p.Amount) ?? 0;

            return new
            {
                totalMembers,
                totalTrainers,
                activeSubscriptions,
                totalRevenue
            };
        }
    }
}
