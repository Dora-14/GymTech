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

            var result = await controller.Assign(new AssignRequest(1, 1));

            var okResult = Assert.IsType<OkObjectResult>(result);


            Assert.NotNull(okResult.Value);
        }


        [Fact]
        public async Task GetById_ExistingTrainer_Returns200Ok()
        {
            using var context = GetDbContext();
            var trainer = new Trainer { TrainerId = 10, FullName = "Coach Sarah", Speciality = "Pilates", Phone = "555" };
            context.Trainers.Add(trainer);
            await context.SaveChangesAsync();

            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.GetById(10);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedTrainer = Assert.IsType<Trainer>(okResult.Value);
            Assert.Equal("Coach Sarah", returnedTrainer.FullName);
        }

        [Fact]
        public async Task GetById_NonExistentTrainer_Returns404NotFound()
        {
            using var context = GetDbContext();
            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.GetById(999);

            Assert.IsType<NotFoundObjectResult>(result);
        }



        [Fact]
        public async Task Update_NonExistentTrainer_Returns404NotFound()
        {
            using var context = GetDbContext();
            var controller = new TrainerController(new TrainerService(context));
            var updatePayload = new Trainer { TrainerId = 99, FullName = "Ghost Coach", Speciality = "None" };

            var result = await controller.Update(99, updatePayload);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Delete_ExistingTrainer_Returns204NoContent()
        {
            using var context = GetDbContext();
            var trainer = new Trainer { TrainerId = 5, FullName = "Temporary Coach", Speciality = "Cardio" };
            context.Trainers.Add(trainer);
            await context.SaveChangesAsync();

            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.Delete(5);

            Assert.IsType<NoContentResult>(result);

            var exists = await context.Trainers.AnyAsync(t => t.TrainerId == 5);
            Assert.False(exists);
        }

        [Fact]
        public async Task Delete_NonExistentTrainer_Returns404NotFound()
        {
            using var context = GetDbContext();
            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.Delete(999);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetMembers_ValidTrainer_ReturnsOkWithList()
        {
            using var context = GetDbContext();
            int trainerId = 2;

            context.Trainers.Add(new Trainer { TrainerId = trainerId, FullName = "Coach Mike", Speciality = "Strength" });
            context.Members.Add(new Member { MemberId = 50, FullName = "Gym Member", Email = "m@g.com", Phone = "0" });
            context.MemberTrainers.Add(new MemberTrainer { TrainerId = trainerId, MemberId = 50 });
            await context.SaveChangesAsync();

            var controller = new TrainerController(new TrainerService(context));

            var result = await controller.GetMembers(trainerId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var members = Assert.IsAssignableFrom<IEnumerable<Member>>(okResult.Value);
            Assert.NotEmpty(members);
        }
    }
}