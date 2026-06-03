using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class AuthControllerTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"AuthDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Login_Invalid_Returns401()
        {
            using var context = GetDbContext();
            var controller = new AuthController(new AuthService(context));

            var result = await controller.Login(new LoginRequest("wrong@gym.com", "badpass"));

            Assert.IsType<UnauthorizedObjectResult>(result);
        }


        [Fact]
        public async Task Login_Valid_Returns200Ok()
        {

            using var context = GetDbContext();


            var existingUser = new UserAccount { UserId = 1, Username = "member@gym.com", PasswordHash = "hashed_password_here", Role = "Member" };
            context.AdminUsers.Add(existingUser);
            await context.SaveChangesAsync();

            var controller = new AuthController(new AuthService(context));


            var result = await controller.Login(new LoginRequest("member@gym.com", "hashed_password_here"));


            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }


        // REGISTER TESTS


        [Fact]
        public async Task Register_Valid_Returns201()
        {

            using var context = GetDbContext();
            var controller = new AuthController(new AuthService(context));
            var newRequest = new RegisterRequest("Jane", "Doe", "jane@gym.com", "555-1234", "securePass123");


            var result = await controller.Register(newRequest);


            var createdResult = Assert.IsType<CreatedAtRouteResult>(result);
            Assert.NotNull(createdResult.Value);


            var userInDb = await context.AdminUsers.AnyAsync(u => u.Username == "jane@gym.com");
            Assert.True(userInDb);
        }

        [Fact]
        public async Task Register_DuplicateEmail_Returns409()
        {
            using var context = GetDbContext();

            context.AdminUsers.Add(new UserAccount
            {
                UserId = 2,
                Username = "duplicate@gym.com",
                Email = "duplicate@gym.com",
                PasswordHash = "password",
                Role = "Member"
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(new AuthService(context));
            var duplicateRequest = new RegisterRequest("John", "Smith", "duplicate@gym.com", "555-0000", "anyPassword");


            var result = await controller.Register(duplicateRequest);


            Assert.IsType<ConflictObjectResult>(result);
        }
    }
}