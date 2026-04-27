namespace GymManagementSystem.Api.Models
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public DateTime Date { get; set; }
        public DateTime CheckInTime { get; set; }

        public int MemberId { get; set; }
        public Member? Member { get; set; }
    }
}