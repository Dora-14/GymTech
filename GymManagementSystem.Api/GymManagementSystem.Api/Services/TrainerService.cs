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

        public async Task<Trainer?> GetByIdAsync(int id)
        {
            return await _context.Trainers
                .Include(t => t.MemberTrainers)
                    .ThenInclude(mt => mt.Member)
                .FirstOrDefaultAsync(t => t.TrainerId == id);
        }

        public async Task<Trainer> AddAsync(Trainer trainer)
        {
            _context.Trainers.Add(trainer);
            await _context.SaveChangesAsync();
            return trainer;
        }

        public async Task<Trainer?> UpdateAsync(int id, Trainer updatedTrainer)
        {
            var existing = await _context.Trainers.FindAsync(id);
            if (existing == null) return null;

            existing.FullName = updatedTrainer.FullName;
            existing.Speciality = updatedTrainer.Speciality;
            existing.Phone = updatedTrainer.Phone;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var trainer = await _context.Trainers.FindAsync(id);
            if (trainer == null) return false;

            _context.Trainers.Remove(trainer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Member>> GetMembersByTrainerAsync(int trainerId)
        {
            return await _context.MemberTrainers
                .Where(mt => mt.TrainerId == trainerId)
                .Include(mt => mt.Member)
                .Where(mt => mt.Member != null)
                .Select(mt => mt.Member!)
                .ToListAsync();
        }

        public async Task AssignMemberToTrainerAsync(int memberId, int trainerId)
        {
            var assignment = new MemberTrainer { MemberId = memberId, TrainerId = trainerId };
            _context.MemberTrainers.Add(assignment);
            await _context.SaveChangesAsync();
        }
    }
}