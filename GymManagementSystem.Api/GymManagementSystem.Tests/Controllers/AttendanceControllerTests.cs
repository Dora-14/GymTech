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
        public async Task CheckIn_ValidActiveMember_ReturnsOkResult()
        {
            using var context = GetDbContext();

            var member = new Member { MemberId = 1, FullName = "John Doe", Email = "john@g.com", Phone = "123" };
            context.Members.Add(member);

            context.Subscriptions.Add(new Subscription
            {
                SubscriptionId = 100,
                MemberId = 1,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-5),
                EndDate = DateTime.Now.AddDays(25),
                Type = "Standard"
            });

            await context.SaveChangesAsync();

            var controller = new AttendanceController(new AttendanceService(context));


            var result = await controller.CheckIn(1);


            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task CheckIn_NoSubscription_Fails()
        {

            using var context = GetDbContext();
            context.Members.Add(new Member { MemberId = 99, FullName = "No Sub User", Email = "nosub@g.com", Phone = "123" });
            await context.SaveChangesAsync();

            var controller = new AttendanceController(new AttendanceService(context));


            var result = await controller.CheckIn(99);


            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);

        }

        [Fact]
        public async Task GetByMember_ExistingRecords_ReturnsOkWithList()
        {

            using var context = GetDbContext();
            int memberId = 5;

            context.Attendances.AddRange(
                new Attendance { AttendanceId = 1, MemberId = memberId, CheckInTime = DateTime.UtcNow.AddDays(-1) },
                new Attendance { AttendanceId = 2, MemberId = memberId, CheckInTime = DateTime.UtcNow }
            );
            await context.SaveChangesAsync();

            var controller = new AttendanceController(new AttendanceService(context));


            var result = await controller.GetByMember(memberId);


            var okResult = Assert.IsType<OkObjectResult>(result);
            var records = Assert.IsAssignableFrom<IEnumerable<Attendance>>(okResult.Value);
            Assert.Equal(2, ((List<Attendance>)records).Count);
        }

        [Fact]
        public async Task GetAll_EmptyDatabase_ReturnsOkWithEmptyList()
        {
            using var context = GetDbContext();
            var controller = new AttendanceController(new AttendanceService(context));

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var records = Assert.IsAssignableFrom<IEnumerable<Attendance>>(okResult.Value);
            Assert.Empty(records);
        }
    }
}