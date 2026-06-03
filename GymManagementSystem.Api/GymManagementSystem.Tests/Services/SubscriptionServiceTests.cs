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


        [Fact]
        public async Task AddSubscription_ValidPayload_CalculatesEndDateAndCreatesPayment()
        {
            using var context = GetDbContext();
            var service = new SubscriptionService(context);

            var baseTime = new DateTime(2026, 6, 1);
            var sub = new Subscription
            {
                SubscriptionId = 20,
                MemberId = 5,
                StartDate = baseTime,
                DurationDays = 30,
                Price = 150m,
                Type = "Standard"
            };

            var result = await service.AddSubscriptionAsync(sub);

            Assert.Equal(baseTime.AddDays(30), result.EndDate);
            Assert.True(result.IsActive);

            var generatedPayment = await context.Payments.FirstOrDefaultAsync(p => p.MemberId == 5);
            Assert.NotNull(generatedPayment);
            Assert.Equal(150m, generatedPayment.Amount);
            Assert.Equal("Subscription Payment", generatedPayment.Method);
        }


        [Fact]
        public async Task AddSubscription_OverlappingStandardSubscription_ThrowsException()
        {
            using var context = GetDbContext();
            int memberId = 7;

            context.Subscriptions.Add(new Subscription
            {
                SubscriptionId = 50,
                MemberId = memberId,
                IsActive = true,
                StartDate = new DateTime(2026, 6, 1),
                EndDate = new DateTime(2026, 6, 30),
                Type = "Standard"
            });
            await context.SaveChangesAsync();

            var service = new SubscriptionService(context);

            var conflictingSub = new Subscription
            {
                SubscriptionId = 51,
                MemberId = memberId,
                StartDate = new DateTime(2026, 6, 15),
                DurationDays = 30,
                Type = "Premium"
            };

            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await service.AddSubscriptionAsync(conflictingSub)
            );

            Assert.Contains("Eroare: Membrul are deja un abonament activ", exception.Message);
        }

        [Fact]
        public async Task AddSubscription_ParallelTrainerAndStandardSubscription_Succeeds()
        {
            using var context = GetDbContext();
            int memberId = 12;

            context.Subscriptions.Add(new Subscription
            {
                SubscriptionId = 60,
                MemberId = memberId,
                IsActive = true,
                StartDate = new DateTime(2026, 6, 1),
                EndDate = new DateTime(2026, 6, 30),
                Type = "Standard"
            });
            await context.SaveChangesAsync();

            var service = new SubscriptionService(context);

            var trainerSub = new Subscription
            {
                SubscriptionId = 61,
                MemberId = memberId,
                StartDate = new DateTime(2026, 6, 10),
                DurationDays = 10,
                Type = "Trainer",
                Price = 120m
            };

            var exception = await Record.ExceptionAsync(() => service.AddSubscriptionAsync(trainerSub));

            Assert.Null(exception);
            Assert.True(trainerSub.IsActive);
        }



        [Fact]
        public async Task GetAll_ReturnsEverything()
        {
            using var context = GetDbContext();
            context.Subscriptions.AddRange(
                new Subscription { SubscriptionId = 11, MemberId = 1, StartDate = DateTime.Now, EndDate = DateTime.Now },
                new Subscription { SubscriptionId = 12, MemberId = 2, StartDate = DateTime.Now, EndDate = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var service = new SubscriptionService(context);

            var allSubs = await service.GetAllAsync();

            Assert.Equal(2, allSubs.Count);
        }
    }
}
