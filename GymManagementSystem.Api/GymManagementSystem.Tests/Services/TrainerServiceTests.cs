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


        [Fact]
        public async Task GetById_ExistingTrainer_ReturnsTrainerWithRelations()
        {
            using var context = GetDbContext();
            context.Trainers.Add(new Trainer { TrainerId = 15, FullName = "Coach Luke", Speciality = "HIIT", Phone = "555" });
            await context.SaveChangesAsync();

            var service = new TrainerService(context);

            var result = await service.GetByIdAsync(15);

            Assert.NotNull(result);
            Assert.Equal("Coach Luke", result.FullName);
        }

        [Fact]
        public async Task Update_ExistingTrainer_ModifiesPropertiesAndReturnsTrainer()
        {
            using var context = GetDbContext();
            context.Trainers.Add(new Trainer { TrainerId = 30, FullName = "Old Name", Speciality = "Zumba", Phone = "111" });
            await context.SaveChangesAsync();

            var service = new TrainerService(context);
            var updateData = new Trainer { FullName = "New Name", Speciality = "Pilates", Phone = "222" };

            var result = await service.UpdateAsync(30, updateData);

            Assert.NotNull(result);
            Assert.Equal("New Name", result.FullName);
            Assert.Equal("Pilates", result.Speciality);

            var dbRecord = await context.Trainers.FindAsync(30);
            Assert.Equal("222", dbRecord.Phone);
        }

        [Fact]
        public async Task Update_InvalidId_ReturnsNull()
        {
            using var context = GetDbContext();
            var service = new TrainerService(context);

            var result = await service.UpdateAsync(999, new Trainer { FullName = "Ghost" });

            Assert.Null(result);
        }

        [Fact]
        public async Task Delete_ExistingTrainer_RemovesRecordAndReturnsTrue()
        {
            using var context = GetDbContext();
            context.Trainers.Add(new Trainer { TrainerId = 40, FullName = "Temporary Coach", Speciality = "None", Phone = "0" });
            await context.SaveChangesAsync();

            var service = new TrainerService(context);

            var result = await service.DeleteAsync(40);

            Assert.True(result);
            var exists = await context.Trainers.AnyAsync(t => t.TrainerId == 40);
            Assert.False(exists);
        }

        [Fact]
        public async Task Delete_InvalidId_ReturnsFalse()
        {
            using var context = GetDbContext();
            var service = new TrainerService(context);

            var result = await service.DeleteAsync(999);

            Assert.False(result);
        }


        [Fact]
        public async Task GetMembersByTrainer_ValidId_ReturnsProjectedMemberList()
        {
            using var context = GetDbContext();
            int trainerId = 7;

            context.Trainers.Add(new Trainer { TrainerId = trainerId, FullName = "Coach Sarah", Speciality = "Crossfit", Phone = "4" });
            context.Members.AddRange(
                new Member { MemberId = 50, FullName = "Client A", Email = "a@g.com", Phone = "1" },
                new Member { MemberId = 51, FullName = "Client B", Email = "b@g.com", Phone = "2" }
            );

            context.MemberTrainers.AddRange(
                new MemberTrainer { TrainerId = trainerId, MemberId = 50 },
                new MemberTrainer { TrainerId = trainerId, MemberId = 51 }
            );
            await context.SaveChangesAsync();

            var service = new TrainerService(context);

            var results = await service.GetMembersByTrainerAsync(trainerId);

            Assert.Equal(2, results.Count);
            Assert.Contains(results, m => m.FullName == "Client A");
            Assert.Contains(results, m => m.FullName == "Client B");
        }
    }
}