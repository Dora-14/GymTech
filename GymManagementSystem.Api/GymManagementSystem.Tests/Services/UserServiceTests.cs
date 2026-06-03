using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class UserServiceTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"UserServiceDb_{Guid.NewGuid()}").Options);


        [Fact]
        public async Task GetAll_HasRecords_ReturnsAllUsers()
        {
            using var context = GetDbContext();
            context.AdminUsers.AddRange(
                new UserAccount { UserId = 1, Username = "admin", Email = "admin@g.com", Role = "Admin", PasswordHash = "hash1" },
                new UserAccount { UserId = 2, Username = "staff", Email = "staff@g.com", Role = "Staff", PasswordHash = "hash2" }
            );
            await context.SaveChangesAsync();

            var service = new UserService(context);


            var results = await service.GetAllAsync();

            Assert.Equal(2, results.Count);
        }


        [Fact]
        public async Task Create_ValidUser_SavesToDatabase()
        {
            using var context = GetDbContext();
            var service = new UserService(context);
            var newUser = new UserAccount { UserId = 10, Username = "manager", Email = "m@g.com", Role = "Manager", PasswordHash = "pass123" };

            var result = await service.CreateAsync(newUser);

            Assert.NotNull(result);
            var saved = await context.AdminUsers.FindAsync(10);
            Assert.NotNull(saved);
            Assert.Equal("manager", saved.Username);
        }


        [Fact]
        public async Task Update_UserExists_ModifiesProperties()
        {
            using var context = GetDbContext();
            context.AdminUsers.Add(new UserAccount { UserId = 5, Username = "old_user", Email = "old@g.com", Role = "Staff", PasswordHash = "keep_this" });
            await context.SaveChangesAsync();

            var service = new UserService(context);

            var updatedData = new UserAccount { Username = "new_user", Email = "new@g.com", Role = "Admin", PasswordHash = "new_hash" };

            var result = await service.UpdateAsync(5, updatedData);

            Assert.NotNull(result);
            Assert.Equal("new_user", result.Username);
            Assert.Equal("new_hash", result.PasswordHash);
        }

        [Fact]
        public async Task Update_EmptyPasswordHash_DoesNotOverwritePassword()
        {
            using var context = GetDbContext();
            context.AdminUsers.Add(new UserAccount { UserId = 6, Username = "test_user", Email = "t@g.com", Role = "Staff", PasswordHash = "original_secret" });
            await context.SaveChangesAsync();

            var service = new UserService(context);

            var updatedData = new UserAccount { Username = "changed_name", Email = "t@g.com", Role = "Staff", PasswordHash = "   " };

            var result = await service.UpdateAsync(6, updatedData);

            Assert.NotNull(result);
            Assert.Equal("changed_name", result.Username);
            Assert.Equal("original_secret", result.PasswordHash);
        }

        [Fact]
        public async Task Update_InvalidId_ReturnsNull()
        {
            using var context = GetDbContext();
            var service = new UserService(context);

            var result = await service.UpdateAsync(999, new UserAccount { Username = "ghost" });

            Assert.Null(result);
        }


        [Fact]
        public async Task Delete_UserExists_RemovesRecordAndReturnsTrue()
        {
            using var context = GetDbContext();
            context.AdminUsers.Add(new UserAccount { UserId = 20, Username = "temp", Email = "temp@g.com", Role = "Staff", PasswordHash = "1" });
            await context.SaveChangesAsync();

            var service = new UserService(context);

            var result = await service.DeleteAsync(20);

            Assert.True(result);
            var exists = await context.AdminUsers.AnyAsync(u => u.UserId == 20);
            Assert.False(exists);
        }

        [Fact]
        public async Task Delete_InvalidId_ReturnsFalse()
        {
            using var context = GetDbContext();
            var service = new UserService(context);

            var result = await service.DeleteAsync(999);

            Assert.False(result);
        }
    }
}