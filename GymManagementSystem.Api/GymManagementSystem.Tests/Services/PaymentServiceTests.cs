using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class PaymentServiceTests
    {

        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"PaySvcDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Add_SavesCorrectly()
        {
            using var context = GetDbContext();
            var service = new PaymentService(context);
            var pay = new Payment { PaymentId = 1, MemberId = 2, Amount = 100, Date = DateTime.Now, Method = "Card" };

            await service.AddPaymentAsync(pay);

            var saved = await context.Payments.FindAsync(1);
            Assert.NotNull(saved);
            Assert.Equal(100, saved.Amount);
        }

        [Fact]
        public async Task GetByMember_ReturnsHistory()
        {
            using var context = GetDbContext();
            context.Payments.Add(new Payment { PaymentId = 9, MemberId = 4, Amount = 50, Date = DateTime.Now, Method = "Cash" });
            await context.SaveChangesAsync();

            var service = new PaymentService(context);
            var results = await service.GetMemberPaymentsAsync(4);

            Assert.NotEmpty(results);
        }
    }
}
