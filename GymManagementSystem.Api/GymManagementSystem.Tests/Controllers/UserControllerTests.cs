using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class UserControllerTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"UserDb_{Guid.NewGuid()}").Options);


        [Fact]
        public async Task GetAll_ExistingUsers_Returns200OkWithList()
        {
            using var context = GetDbContext();
            context.AdminUsers.AddRange(
                new UserAccount { UserId = 1, Username = "admin1", PasswordHash = "hashed_pass", Role = "Admin" },
                new UserAccount { UserId = 2, Username = "manager1", PasswordHash = "hashed_pass", Role = "Manager" }
            );
            await context.SaveChangesAsync();

            var controller = new UserController(new UserService(context));

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var users = Assert.IsAssignableFrom<IEnumerable<UserAccount>>(okResult.Value);
            Assert.Equal(2, ((List<UserAccount>)users).Count);
        }


        [Fact]
        public async Task Create_ValidUser_Returns201Created()
        {
            using var context = GetDbContext();
            var controller = new UserController(new UserService(context));
            var newUser = new UserAccount { UserId = 3, Username = "receptionist1", PasswordHash = "password123", Role = "Staff" };

            var result = await controller.Create(newUser);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnedUser = Assert.IsType<UserAccount>(createdResult.Value);
            Assert.Equal("receptionist1", returnedUser.Username);

            var exists = await context.AdminUsers.AnyAsync(u => u.UserId == 3);
            Assert.True(exists);
        }



        [Fact]
        public async Task Update_ExistingUser_Returns200OkWithUpdatedData()
        {
            using var context = GetDbContext();
            var originalUser = new UserAccount { UserId = 10, Username = "old_username", PasswordHash = "secure", Role = "Admin" };
            context.AdminUsers.Add(originalUser);
            await context.SaveChangesAsync();

            var controller = new UserController(new UserService(context));
            var updatePayload = new UserAccount { UserId = 10, Username = "new_username", PasswordHash = "secure", Role = "SuperAdmin" };

            var result = await controller.Update(10, updatePayload);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedUser = Assert.IsType<UserAccount>(okResult.Value);
            Assert.Equal("new_username", returnedUser.Username);
            Assert.Equal("SuperAdmin", returnedUser.Role);
        }

        [Fact]
        public async Task Update_NonExistentUser_Returns404NotFound()
        {
            using var context = GetDbContext();
            var controller = new UserController(new UserService(context));
            var updatePayload = new UserAccount { UserId = 999, Username = "ghost", PasswordHash = "123", Role = "Admin" };

            var result = await controller.Update(999, updatePayload);

            Assert.IsType<NotFoundObjectResult>(result);
        }



        [Fact]
        public async Task Delete_ExistingUser_Returns204NoContent()
        {
            using var context = GetDbContext();
            var userToDelete = new UserAccount { UserId = 5, Username = "delete_me", PasswordHash = "password", Role = "Staff" };
            context.AdminUsers.Add(userToDelete);
            await context.SaveChangesAsync();

            var controller = new UserController(new UserService(context));

            var result = await controller.Delete(5);

            Assert.IsType<NoContentResult>(result);

            var exists = await context.AdminUsers.AnyAsync(u => u.UserId == 5);
            Assert.False(exists);
        }

        [Fact]
        public async Task Delete_NonExistentUser_Returns404NotFound()
        {
            using var context = GetDbContext();
            var controller = new UserController(new UserService(context));

            var result = await controller.Delete(999);

            Assert.IsType<NotFoundObjectResult>(result);
        }
    }
}