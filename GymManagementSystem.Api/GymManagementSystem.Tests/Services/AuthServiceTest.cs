using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class AuthServiceTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"AuthSvcDb_{Guid.NewGuid()}").Options);



        [Fact]
        public async Task LogIn_InvalidCredentials_ReturnsNullUser()
        {
            using var context = GetDbContext();
            var service = new AuthService(context);

            var (user, memberId, trainerId) = await service.LogInAsync("ghost@gym.com", "wrongpass");

            Assert.Null(user);
            Assert.Null(memberId);
            Assert.Null(trainerId);
        }

        [Fact]
        public async Task LogIn_MemberRole_ReturnsUserAndLinkedMemberId()
        {
            using var context = GetDbContext();
            string email = "member@gym.com";
            string pass = "secure123";

            context.AdminUsers.Add(new UserAccount
            {
                UserId = 1,
                Username = email,
                PasswordHash = pass,
                Email = email,
                Role = "Member"
            });
            context.Members.Add(new Member
            {
                MemberId = 88,
                FullName = "Gym Goer",
                Email = email,
                Phone = "123"
            });
            await context.SaveChangesAsync();

            var service = new AuthService(context);

            var (user, memberId, trainerId) = await service.LogInAsync(email, pass);

            Assert.NotNull(user);
            Assert.Equal("Member", user.Role);
            Assert.Equal(88, memberId);
        }


        [Fact]
        public async Task ChangePassword_UserExists_UpdatesHashAndReturnsTrue()
        {
            using var context = GetDbContext();
            context.AdminUsers.Add(new UserAccount
            {
                UserId = 10,
                Username = "user10",
                PasswordHash = "old_pass",
                Email = "u@g.com",
                Role = "Admin"
            });
            await context.SaveChangesAsync();

            var service = new AuthService(context);

            var result = await service.ChangePasswordAsync(10, "brand_new_pass");

            Assert.True(result);
            var updatedUser = await context.AdminUsers.FindAsync(10);
            Assert.Equal("brand_new_pass", updatedUser.PasswordHash);
        }

        [Fact]
        public async Task ChangePassword_UserDoesNotExist_ReturnsFalse()
        {
            using var context = GetDbContext();
            var service = new AuthService(context);

            var result = await service.ChangePasswordAsync(999, "any_pass");

            Assert.False(result);
        }


        [Fact]
        public async Task Register_NewEmail_CreatesBothMemberAndAccount()
        {
            using var context = GetDbContext();
            var service = new AuthService(context);

            var (account, member) = await service.RegisterAsync(
                "John", "Doe", "john.doe@gym.com", "555-1234", "mySecretPass");

            Assert.NotNull(account);
            Assert.NotNull(member);
            Assert.Equal("John Doe", member.FullName);
            Assert.Equal("Member", account.Role);

            // Verify both saved securely into the memory context
            var accountExists = await context.AdminUsers.AnyAsync(u => u.Email == "john.doe@gym.com");
            var memberExists = await context.Members.AnyAsync(m => m.Email == "john.doe@gym.com");

            Assert.True(accountExists);
            Assert.True(memberExists);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ThrowsException()
        {
            using var context = GetDbContext();
            string duplicateEmail = "taken@gym.com";

            context.AdminUsers.Add(new UserAccount
            {
                UserId = 5,
                Username = duplicateEmail,
                PasswordHash = "123",
                Email = duplicateEmail,
                Role = "Member"
            });
            await context.SaveChangesAsync();

            var service = new AuthService(context);

            var exception = await Assert.ThrowsAsync<Exception>(async () =>
                await service.RegisterAsync("Jane", "Smith", duplicateEmail, "000", "pass")
            );

            Assert.Contains("already exists", exception.Message);
        }
    }
}