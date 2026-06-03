using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Method { get; set; } = string.Empty; // Cash, Card, etc.

        public int MemberId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Member? Member { get; set; }
    }
}