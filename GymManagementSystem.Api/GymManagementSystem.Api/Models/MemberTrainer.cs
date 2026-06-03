namespace GymManagementSystem.Api.Models
{
    public class MemberTrainer
    {
        public int MemberId { get; set; }
        public Member? Member { get; set; }

        public int TrainerId { get; set; }
        public Trainer? Trainer { get; set; }
    }
}