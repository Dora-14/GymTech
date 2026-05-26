using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Member
    {
        [Key]
        public int MemberId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        [JsonIgnore]
        public List<Subscription> Subscriptions { get; set; } = new();
        [JsonIgnore]
        public List<Payment> Payments { get; set; } = new();
        [JsonIgnore]
        public List<Attendance> Attendances { get; set; } = new();
        [JsonIgnore]
        public List<MemberTrainer> MemberTrainers { get; set; } = new();
    }
}