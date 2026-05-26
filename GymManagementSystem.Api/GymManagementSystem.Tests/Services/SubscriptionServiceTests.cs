using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class SubscriptionServiceTests
    {

        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"SubSvcDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Add_SavesCorrectly()
        {
            using var context = GetDbContext();
            var service = new SubscriptionService(context);
            var sub = new Subscription { SubscriptionId = 1, MemberId = 10, StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(30) };

            await service.AddSubscriptionAsync(sub);

            var saved = await context.Subscriptions.FindAsync(1);
            Assert.NotNull(saved);
            Assert.Equal(10, saved.MemberId);
        }

        [Fact]
        public async Task GetByMember_ReturnsHistory()
        {
            using var context = GetDbContext();
            context.Subscriptions.Add(new Subscription { SubscriptionId = 5, MemberId = 3, StartDate = DateTime.Now, EndDate = DateTime.Now });
            await context.SaveChangesAsync();

            var service = new SubscriptionService(context);
            var results = await service.GetMemberSubscriptionsAsync(3);

            Assert.NotEmpty(results);
        }
    }
}
