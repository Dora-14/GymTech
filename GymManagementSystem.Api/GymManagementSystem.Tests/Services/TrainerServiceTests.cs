using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class TrainerServiceTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"TrainerServiceDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Add_SavesCorrectly()
        {
            using var context = GetDbContext();
            var service = new TrainerService(context);
            var trainer = new Trainer { TrainerId = 1, FullName = "Coach Mike", Speciality = "Weights", Phone = "1" };

            await service.AddAsync(trainer);

            var saved = await context.Trainers.FindAsync(1);
            Assert.NotNull(saved);
            Assert.Equal("Coach Mike", saved.FullName);
        }

        [Fact]
        public async Task Assign_SavesRelationship()
        {
            using var context = GetDbContext();

            context.Members.Add(new Member { MemberId = 10, FullName = "Gym Member", Email = "mem@g.com", Phone = "123" });
            context.Trainers.Add(new Trainer { TrainerId = 5, FullName = "Trainer Bob", Speciality = "Yoga", Phone = "456" });
            await context.SaveChangesAsync();

            var service = new TrainerService(context);

            await service.AssignMemberToTrainerAsync(10, 5);

            var savedLink = await context.MemberTrainers.FirstOrDefaultAsync(mt => mt.MemberId == 10 && mt.TrainerId == 5);
            Assert.NotNull(savedLink);
        }

        [Fact]
        public async Task GetAll_IncludesMemberRelations()
        {
            using var context = GetDbContext();
            var trainer = new Trainer { TrainerId = 2, FullName = "Coach Anna", Speciality = "Cardio", Phone = "789" };
            var member = new Member { MemberId = 20, FullName = "Runner Rex", Email = "rex@g.com", Phone = "000" };

            context.Trainers.Add(trainer);
            context.Members.Add(member);

            context.MemberTrainers.Add(new MemberTrainer { MemberId = 20, TrainerId = 2 });
            await context.SaveChangesAsync();

            var service = new TrainerService(context);

            var results = await service.GetAllWithMembersAsync();

            Assert.NotEmpty(results);
            var targetTrainer = results.Find(t => t.TrainerId == 2);
            Assert.NotNull(targetTrainer);
            Assert.NotEmpty(targetTrainer.MemberTrainers);
        }
    }
}