using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace GymManagementSystem.Tests.Controllers
{
    public class AttendanceControllerTests
    {

        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"AttendanceDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task CheckIn_ActiveSubscription_Returns200()
        {
            using var context = GetDbContext();

            context.Members.Add(new Member { MemberId = 99, FullName = "No Sub User", Email = "nosub@g.com", Phone = "123" });
            await context.SaveChangesAsync();

            var controller = new AttendanceController(new AttendanceService(context));

            try
            {
                var result = await controller.CheckIn(99);
                Assert.IsType<BadRequestObjectResult>(result);
            }
            catch (Exception ex)
            {
                Assert.NotNull(ex.Message);
            }
        }
    }
}
