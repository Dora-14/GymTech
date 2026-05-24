using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        [Range(1, 10000, ErrorMessage = "Payment amount must be between 1 and 10,000.")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Method { get; set; } = string.Empty; // Cash, Card, etc.

        public int MemberId { get; set; }

        [JsonIgnore]
        public Member? Member { get; set; }
    }
}