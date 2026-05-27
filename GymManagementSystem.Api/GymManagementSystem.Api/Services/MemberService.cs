using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class MemberService
    {
        private readonly AppDbContext _context;

        public MemberService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Member>> GetAllAsync()
        {
            return await _context.Members.ToListAsync();
        }

        public async Task<Member?> GetByIdAsync(int id)
        {
            return await _context.Members
                .Include(m => m.Subscriptions)
                .Include(m => m.Payments)
                .Include(m => m.MemberTrainers)
                    .ThenInclude(mt => mt.Trainer)
                .FirstOrDefaultAsync(m => m.MemberId == id);
        }

        public async Task<List<Member>> SearchAsync(string query)
        {
            var q = query.ToLower();
            return await _context.Members
                .Where(m => m.FullName.ToLower().Contains(q) || m.Email.ToLower().Contains(q))
                .ToListAsync();
        }

        public async Task<Member> AddAsync(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task DeleteAsync(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member != null)
            {
                _context.Members.Remove(member);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Member?> UpdateAsync(int id, Member updatedMember)
        {
            var existingMember = await _context.Members.FindAsync(id);
            if (existingMember == null) return null;

            existingMember.FullName = updatedMember.FullName;
            existingMember.Email = updatedMember.Email;
            existingMember.Phone = updatedMember.Phone;
            existingMember.DateOfBirth = updatedMember.DateOfBirth;

            await _context.SaveChangesAsync();
            return existingMember;
        }
    }
}