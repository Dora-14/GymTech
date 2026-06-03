using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class AttendanceServiceTests
    {

        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"AttendanceSvcDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task CheckIn_NoSubscription_Fails()
        {
            using var context = GetDbContext();
            context.Members.Add(new Member { MemberId = 10, FullName = "No Sub Member", Email = "n@g.com", Phone = "000" });
            await context.SaveChangesAsync();

            var service = new AttendanceService(context);

            //
            await Assert.ThrowsAnyAsync<Exception>(async () =>
                await service.CheckInAsync(10)
            );
        }
    }
}
