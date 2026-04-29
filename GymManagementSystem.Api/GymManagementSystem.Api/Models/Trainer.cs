using System.Text.Json.Serialization;

namespace GymManagementSystem.Api.Models
{
    public class Trainer
    {
        [JsonIgnore]
        public int TrainerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Speciality { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        [JsonIgnore]
        public List<MemberTrainer> MemberTrainers { get; set; } = new();
    }
}