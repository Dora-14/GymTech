using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        public AuthService(AppDbContext context) { _context = context; }

        public async Task<AdminUser?> LogInAsync(string username, string password)
        {
            return await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string newPassword)
        {
            var user = await _context.AdminUsers.FindAsync(userId);
            if (user == null) return false;

            user.PasswordHash = newPassword;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}