namespace GymManagementSystem.Api.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Method { get; set; } = string.Empty; // Cash, Card, etc.

        public int MemberId { get; set; }
        public Member? Member { get; set; }
    }
}