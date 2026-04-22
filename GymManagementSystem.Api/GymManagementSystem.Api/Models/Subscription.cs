namespace GymManagementSystem.Api.Models
{
    public class Subscription
    {
        public int SubscriptionId { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int MemberId { get; set; }
        public Member? Member { get; set; }
    }
}