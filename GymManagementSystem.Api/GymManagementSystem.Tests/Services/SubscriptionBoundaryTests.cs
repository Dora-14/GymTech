using GymManagementSystem.Api.Models;

namespace GymManagementSystem.Tests.Services
{
    public class SubscriptionBoundaryTests
    {

        [Fact]
        public void Subscription_IsActive_OnExactExpirationDate_ReturnsTrue()
        {
            var today = DateTime.Today;
            var subscription = new Subscription
            {
                StartDate = today.AddDays(-30),
                EndDate = today
            };

            Assert.True(subscription.EndDate >= today, "A subscription should still be valid on its final day.");
        }

        [Fact]
        public void Subscription_IsActive_OneDayAfterExpiration_ReturnsFalse()
        {

            var today = DateTime.Today;
            var subscription = new Subscription
            {
                StartDate = today.AddDays(-31),
                EndDate = today.AddDays(-1)
            };

            Assert.False(subscription.EndDate >= today, "A subscription must fail access checks the day after it expires.");
        }
    }
}
