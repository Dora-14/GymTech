using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
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

            var result = await controller.Login("wrong@gym.com", "badpass");

            Assert.IsType<UnauthorizedObjectResult>(result);
        }
    }
}