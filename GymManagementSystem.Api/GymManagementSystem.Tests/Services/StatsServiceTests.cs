using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace GymManagementSystem.Tests.Services
{
    public class StatsServiceTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"StatsServiceDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task GetStats_DatabaseHasData_CalculatesCorrectAggregates()
        {
            using var context = GetDbContext();

            context.Members.AddRange(
                new Member { MemberId = 1, FullName = "Member One", Email = "1@g.com", Phone = "1" },
                new Member { MemberId = 2, FullName = "Member Two", Email = "2@g.com", Phone = "2" }
            );

            context.Trainers.Add(new Trainer { TrainerId = 1, FullName = "Coach Bob", Speciality = "Weights" });

            context.Subscriptions.AddRange(
                new Subscription
                {
                    SubscriptionId = 10,
                    MemberId = 1,
                    IsActive = true,
                    StartDate = DateTime.Now.AddDays(-5),
                    EndDate = DateTime.Now.AddDays(25)
                },
                new Subscription
                {
                    SubscriptionId = 11,
                    MemberId = 2,
                    IsActive = true,
                    StartDate = DateTime.Now.AddDays(-40),
                    EndDate = DateTime.Now.AddDays(-10)
                }
            );

            context.Payments.AddRange(
                new Payment { PaymentId = 1, MemberId = 1, Amount = 150.50m, Date = DateTime.Now, Method = "Card" },
                new Payment { PaymentId = 2, MemberId = 2, Amount = 200.00m, Date = DateTime.Now, Method = "Cash" }
            );

            await context.SaveChangesAsync();
            var service = new StatsService(context);

            var result = await service.GetStatsAsync();

            var json = JsonSerializer.Serialize(result);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            Assert.Equal(2, root.GetProperty("totalMembers").GetInt32());
            Assert.Equal(1, root.GetProperty("totalTrainers").GetInt32());
            Assert.Equal(1, root.GetProperty("activeSubscriptions").GetInt32());
            Assert.Equal(350.50m, root.GetProperty("totalRevenue").GetDecimal());
        }

        [Fact]
        public async Task GetStats_EmptyDatabase_ReturnsZeroValues()
        {
            using var context = GetDbContext();
            var service = new StatsService(context);

            var result = await service.GetStatsAsync();

            var json = JsonSerializer.Serialize(result);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            Assert.Equal(0, root.GetProperty("totalMembers").GetInt32());
            Assert.Equal(0, root.GetProperty("totalTrainers").GetInt32());
            Assert.Equal(0, root.GetProperty("activeSubscriptions").GetInt32());
            Assert.Equal(0m, root.GetProperty("totalRevenue").GetDecimal());
        }
    }
}