using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class SubscriptionService
    {
        private readonly AppDbContext _context;

        public SubscriptionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Subscription> AddSubscriptionAsync(Subscription newSubscription)
        {
            newSubscription.EndDate = newSubscription.StartDate.AddDays(newSubscription.DurationDays);

            var newType = newSubscription.Type;
            var overlappingSubscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.MemberId == newSubscription.MemberId
                                     && s.IsActive
                                     && s.EndDate > newSubscription.StartDate
                                     && (newType == "Trainer" ? s.Type == "Trainer" : s.Type != "Trainer"));

            if (overlappingSubscription != null)
            {
                throw new Exception($"Eroare: Membrul are deja un abonament activ până la {overlappingSubscription.EndDate:dd/MM/yyyy}.");
            }

            newSubscription.IsActive = true;

            var autoPayment = new Payment
            {
                MemberId = newSubscription.MemberId,
                Amount = newSubscription.Price,
                Date = DateTime.Now,
                Method = "Subscription Payment"
            };

            _context.Subscriptions.Add(newSubscription);
            _context.Payments.Add(autoPayment);

            await _context.SaveChangesAsync();
            return newSubscription;
        }

        public async Task<List<Subscription>> GetMemberSubscriptionsAsync(int memberId)
        {
            return await _context.Subscriptions
                .Where(s => s.MemberId == memberId)
                .ToListAsync();
        }

        public async Task<List<Subscription>> GetAllAsync()
        {
            return await _context.Subscriptions.ToListAsync();
        }
    }
}