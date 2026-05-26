using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class PaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> AddPaymentAsync(Payment payment)
        {
            if (payment.Amount <= 0)
                throw new Exception("Suma plății trebuie să fie pozitivă.");

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<List<Payment>> GetMemberPaymentsAsync(int memberId)
        {
            return await _context.Payments
                .Where(p => p.MemberId == memberId)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetAllAsync()
        {
            return await _context.Payments.OrderByDescending(p => p.Date).ToListAsync();
        }
    }
}