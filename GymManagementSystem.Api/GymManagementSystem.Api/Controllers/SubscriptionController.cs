using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    public record SubscriptionPlan(string Name, string Description, decimal Price, int DurationDays, string Badge);

    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionController : ControllerBase
    {
        private static readonly SubscriptionPlan[] Plans =
        [
            new("Basic",   "Full gym equipment, locker rooms & sauna access",                        150m,  30,  ""),
            new("Standard","All Basic perks + group classes & sauna — best value per month",          850m, 180, "Popular"),
            new("Premium", "All Standard perks + unlimited trainer sessions & sauna",               1600m, 365, "Best Value"),
            new("Trainer", "1 month of personal trainer sessions + sauna access",                    120m,  30,  ""),
        ];

        private readonly SubscriptionService _subscriptionService;

        public SubscriptionController(SubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet("plans")]
        public IActionResult GetPlans() => Ok(Plans);

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subs = await _subscriptionService.GetAllAsync();
            return Ok(subs);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Subscription subscription)
        {
            var result = await _subscriptionService.AddSubscriptionAsync(subscription);
            return Ok(result);
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetByMember(int memberId)
        {
            var subscriptions = await _subscriptionService.GetMemberSubscriptionsAsync(memberId);
            return Ok(subscriptions);
        }
    }
}