using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Member
    {
        [Key]
        [JsonIgnore]
        public int MemberId { get; set; }

        [Required(ErrorMessage = "Full name is required.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required.")]
        [StringLength(15, MinimumLength = 10, ErrorMessage = "Phone number must be between 10 and 15 characters long.")]
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