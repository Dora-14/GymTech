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

            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await service.CheckInAsync(10)
            );
            Assert.Contains("Access denied", exception.Message);
        }

        [Fact]
        public async Task CheckIn_ActiveSubscription_SavesRecordAndReturnsAttendance()
        {
            using var context = GetDbContext();
            int memberId = 1;

            context.Members.Add(new Member { MemberId = memberId, FullName = "Active Member", Email = "a@g.com", Phone = "1" });
            context.Subscriptions.Add(new Subscription
            {
                SubscriptionId = 100,
                MemberId = memberId,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-5),
                EndDate = DateTime.Now.AddDays(25)
            });
            await context.SaveChangesAsync();

            var service = new AttendanceService(context);

            var result = await service.CheckInAsync(memberId);

            Assert.NotNull(result);
            Assert.Equal(memberId, result.MemberId);

            var dbRecord = await context.Attendances.FirstOrDefaultAsync(a => a.MemberId == memberId);
            Assert.NotNull(dbRecord);
        }

        [Fact]
        public async Task CheckIn_SubscriptionExpired_ThrowsException()
        {
            using var context = GetDbContext();
            int memberId = 2;

            context.Members.Add(new Member { MemberId = memberId, FullName = "Expired Member", Email = "e@g.com", Phone = "2" });
            context.Subscriptions.Add(new Subscription
            {
                SubscriptionId = 101,
                MemberId = memberId,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-35),
                EndDate = DateTime.Now.AddDays(-5)
            });
            await context.SaveChangesAsync();

            var service = new AttendanceService(context);

            await Assert.ThrowsAsync<Exception>(() => service.CheckInAsync(memberId));
        }


        [Fact]
        public async Task GetByMember_RecordsExist_ReturnsSortedList()
        {
            using var context = GetDbContext();
            int targetMemberId = 5;
            int wrongMemberId = 9;

            context.Attendances.AddRange(
                new Attendance { AttendanceId = 1, MemberId = targetMemberId, Date = DateTime.Now.AddDays(-2) },
                new Attendance { AttendanceId = 2, MemberId = targetMemberId, Date = DateTime.Now }, // Newest
                new Attendance { AttendanceId = 3, MemberId = wrongMemberId, Date = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var service = new AttendanceService(context);

            var results = await service.GetByMemberAsync(targetMemberId);

            Assert.Equal(2, results.Count);
            Assert.Equal(2, results[0].AttendanceId);
            Assert.Equal(1, results[1].AttendanceId);
        }

        [Fact]
        public async Task GetAll_MultipleRecords_ReturnsAllRecordsSorted()
        {
            using var context = GetDbContext();
            context.Attendances.AddRange(
                new Attendance { AttendanceId = 10, MemberId = 1, Date = DateTime.Now.AddDays(-1) },
                new Attendance { AttendanceId = 11, MemberId = 2, Date = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var service = new AttendanceService(context);

            var results = await service.GetAllAsync();

            Assert.Equal(2, results.Count);
            Assert.Equal(11, results[0].AttendanceId);
        }
    }
}