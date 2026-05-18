using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class TrainerService
    {
        private readonly AppDbContext _context;
        public TrainerService(AppDbContext context) { _context = context; }

        public async Task<List<Trainer>> GetAllWithMembersAsync()
        {
            return await _context.Trainers
                .Include(t => t.MemberTrainers)  
                    .ThenInclude(mt => mt.Member)  
                .ToListAsync();
        }

        public async Task<Trainer> AddAsync(Trainer trainer)
        {
            _context.Trainers.Add(trainer);
            await _context.SaveChangesAsync();
            return trainer;
        }

        public async Task AssignMemberToTrainerAsync(int memberId, int trainerId)
        {
            var assignment = new MemberTrainer { MemberId = memberId, TrainerId = trainerId };
            _context.MemberTrainers.Add(assignment);
            await _context.SaveChangesAsync();
        }
    }
}