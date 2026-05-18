using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Subscription
    {

        [JsonIgnore]
        public int SubscriptionId { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Type { get; set; } = string.Empty;
        [Range(0.01, 10000, ErrorMessage = "Prețul trebuie să fie mai mare de 0!")]
        public decimal Price { get; set; }
        [Range(1, 365, ErrorMessage = "Durata trebuie să fie între 1 și 365 de zile!")]
        public int DurationDays { get; set; }
        public DateTime StartDate { get; set; }
        [JsonIgnore]
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int MemberId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Member? Member { get; set; }
        
    }
}