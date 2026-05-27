using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context) { _context = context; }

        public async Task<List<UserAccount>> GetAllAsync()
        {
            return await _context.AdminUsers.ToListAsync();
        }

        public async Task<UserAccount> CreateAsync(UserAccount user)
        {
            _context.AdminUsers.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<UserAccount?> UpdateAsync(int id, UserAccount updated)
        {
            var existing = await _context.AdminUsers.FindAsync(id);
            if (existing == null) return null;

            existing.Username = updated.Username;
            existing.Email = updated.Email;
            existing.Role = updated.Role;
            if (!string.IsNullOrWhiteSpace(updated.PasswordHash))
                existing.PasswordHash = updated.PasswordHash;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.AdminUsers.FindAsync(id);
            if (user == null) return false;

            _context.AdminUsers.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
