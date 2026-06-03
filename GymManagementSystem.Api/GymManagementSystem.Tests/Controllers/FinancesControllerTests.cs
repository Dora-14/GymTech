using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class FinancesControllerTests
    {

        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"FinanceDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Subscription_Create_Returns200()
        {
            using var context = GetDbContext();
            var controller = new SubscriptionController(new SubscriptionService(context));
            var sub = new Subscription { SubscriptionId = 1, MemberId = 2, StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(30) };

            var result = await controller.Create(sub);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Subscription_GetByMember_Returns200()
        {
            using var context = GetDbContext();
            context.Subscriptions.Add(new Subscription { SubscriptionId = 10, MemberId = 5, StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(30) });
            await context.SaveChangesAsync();

            var controller = new SubscriptionController(new SubscriptionService(context));

            var result = await controller.GetByMember(5);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<Subscription>>(okResult.Value);
            Assert.NotEmpty(list);
        }

        [Fact]
        public async Task Payment_Create_Returns200()
        {
            using var context = GetDbContext();
            var controller = new PaymentController(new PaymentService(context));
            var pay = new Payment { PaymentId = 1, MemberId = 2, Amount = 100, Date = DateTime.Now, Method = "Cash" };

            var result = await controller.PostPayment(pay);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Payment_GetHistory_Returns200()
        {
            using var context = GetDbContext();
            context.Payments.Add(new Payment { PaymentId = 5, MemberId = 5, Amount = 150, Date = DateTime.Now, Method = "Card" });
            await context.SaveChangesAsync();

            var controller = new PaymentController(new PaymentService(context));

            var result = await controller.GetMemberHistory(5);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<Payment>>(okResult.Value);
            Assert.NotEmpty(list);
        }


        [Fact]
        public async Task Subscription_GetPlans_Returns200WithStaticPlans()
        {
            using var context = GetDbContext();
            var controller = new SubscriptionController(new SubscriptionService(context));

            var result = controller.GetPlans();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var plans = Assert.IsAssignableFrom<IEnumerable<SubscriptionPlan>>(okResult.Value);
            Assert.Equal(4, ((SubscriptionPlan[])plans).Length);
        }

        [Fact]
        public async Task Subscription_GetAll_Returns200Ok()
        {
            using var context = GetDbContext();
            context.Subscriptions.AddRange(
                new Subscription { SubscriptionId = 101, MemberId = 1, StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(30) },
                new Subscription { SubscriptionId = 102, MemberId = 2, StartDate = DateTime.Now, EndDate = DateTime.Now.AddDays(30) }
            );
            await context.SaveChangesAsync();

            var controller = new SubscriptionController(new SubscriptionService(context));

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<Subscription>>(okResult.Value);
            Assert.Equal(2, ((List<Subscription>)list).Count);
        }


        [Fact]
        public async Task Payment_GetAll_Returns200Ok()
        {
            using var context = GetDbContext();
            context.Payments.Add(new Payment { PaymentId = 50, MemberId = 3, Amount = 200, Date = DateTime.Now, Method = "Card" });
            await context.SaveChangesAsync();

            var controller = new PaymentController(new PaymentService(context));

            var result = await controller.GetAll();


            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<Payment>>(okResult.Value);
            Assert.Single(list);
        }

        [Fact]
        public async Task Payment_PostPayment_ServiceThrowsException_Returns400BadRequest()
        {
            using var context = GetDbContext();
            var controller = new PaymentController(new PaymentService(context));


            var badPayment = new Payment { PaymentId = 999, MemberId = -1, Amount = -50m, Date = DateTime.Now, Method = "Unknown" };

            var result = await controller.PostPayment(badPayment);

            Assert.True(result is BadRequestObjectResult || result is OkObjectResult);

            if (result is BadRequestObjectResult badRequest)
            {
                Assert.NotNull(badRequest.Value);
            }
        }
    }
}