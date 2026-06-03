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


        [Theory]
        [InlineData(0)]
        [InlineData(-150)]
        public async Task AddPayment_NegativeOrZeroAmount_ThrowsException(decimal invalidAmount)
        {
            using var context = GetDbContext();
            var service = new PaymentService(context);
            var badPayment = new Payment
            {
                PaymentId = 99,
                MemberId = 1,
                Amount = invalidAmount,
                Date = DateTime.Now,
                Method = "Cash"
            };


            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await service.AddPaymentAsync(badPayment)
            );

            Assert.Equal("Suma plății trebuie să fie pozitivă.", exception.Message);
        }



        [Fact]
        public async Task GetMemberPayments_NoHistoryExists_ReturnsEmptyList()
        {
            using var context = GetDbContext();
            var service = new PaymentService(context);

            var results = await service.GetMemberPaymentsAsync(999);

            Assert.NotNull(results);
            Assert.Empty(results);
        }

        [Fact]
        public async Task GetAll_WithMultiplePayments_ReturnsAllSortedByDate()
        {
            using var context = GetDbContext();

            var olderPayment = new Payment { PaymentId = 10, MemberId = 1, Amount = 100, Date = DateTime.Now.AddDays(-2), Method = "Card" };
            var newerPayment = new Payment { PaymentId = 11, MemberId = 2, Amount = 200, Date = DateTime.Now, Method = "Cash" };

            context.Payments.AddRange(olderPayment, newerPayment);
            await context.SaveChangesAsync();

            var service = new PaymentService(context);

            var results = await service.GetAllAsync();

            Assert.Equal(2, results.Count);
            Assert.Equal(11, results[0].PaymentId);
            Assert.Equal(10, results[1].PaymentId);
        }
    }
}
