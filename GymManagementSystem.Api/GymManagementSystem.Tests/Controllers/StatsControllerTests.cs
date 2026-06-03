using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class StatsControllerTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"StatsDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task GetStats_Returns200Ok_WithValidStatsData()
        {
            using var context = GetDbContext();

            context.Members.Add(new Member { MemberId = 1, FullName = "Active Member", Email = "a@g.com", Phone = "111" });
            context.Payments.Add(new Payment { PaymentId = 1, MemberId = 1, Amount = 200m, Date = DateTime.UtcNow, Method = "Card" });
            context.Attendances.Add(new Attendance { AttendanceId = 1, MemberId = 1, Date = DateTime.UtcNow, CheckInTime = DateTime.UtcNow });
            await context.SaveChangesAsync();

            var statsService = new StatsService(context);
            var controller = new StatsController(statsService);

            var result = await controller.GetStats();

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);


        }
    }
}