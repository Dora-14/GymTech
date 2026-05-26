using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        public AuthService(AppDbContext context) { _context = context; }

        public async Task<(UserAccount? user, int? memberId, int? trainerId)> LogInAsync(string username, string password)
        {
            var user = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);

            int? memberId = null;
            if (user?.Role == "Member")
            {
                var member = await _context.Members.FirstOrDefaultAsync(m => m.Email == user.Email);
                memberId = member?.MemberId;
            }

            return (user, memberId, user?.TrainerId);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string newPassword)
        {
            var user = await _context.AdminUsers.FindAsync(userId);
            if (user == null) return false;

            user.PasswordHash = newPassword;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(UserAccount account, Member member)> RegisterAsync(
            string firstName, string lastName, string email, string phone, string password)
        {
            var emailTaken = await _context.AdminUsers
                .AnyAsync(u => u.Email == email);
            if (emailTaken)
                throw new Exception("An account with this email already exists.");

            var member = new Member
            {
                FullName = $"{firstName} {lastName}",
                Email = email,
                Phone = phone,
                DateOfBirth = DateTime.MinValue,
                RegistrationDate = DateTime.Now
            };
            _context.Members.Add(member);

            var account = new UserAccount
            {
                Username = email,
                PasswordHash = password,
                Email = email,
                Role = "Member"
            };
            _context.AdminUsers.Add(account);

            await _context.SaveChangesAsync();
            return (account, member);
        }
    }
}