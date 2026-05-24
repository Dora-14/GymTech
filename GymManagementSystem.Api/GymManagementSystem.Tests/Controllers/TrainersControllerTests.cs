using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class TrainersControllerTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"TrainerDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task GetAll_Exist_Returns200()
        {
            using var context = GetDbContext();
            context.Trainers.Add(new Trainer { TrainerId = 1, FullName = "Coach Bob", Speciality = "Yoga", Phone = "1" });
            await context.SaveChangesAsync();

            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<Trainer>>(okResult.Value);
            Assert.NotEmpty(list);
        }

        [Fact]
        public async Task Assign_Valid_Returns200()
        {
            using var context = GetDbContext();
            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.Assign(memberId: 1, trainerId: 1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Membru asigurat antrenorului cu succes!", okResult.Value);
        }
    }
}