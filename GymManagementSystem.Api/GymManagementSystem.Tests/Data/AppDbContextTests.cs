using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Data
{
    public class AppDbContextTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"AppDataDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task Schema_SavesEntitiesDirectly()
        {
            // Arrange
            using var context = GetDbContext();
            var member = new Member { MemberId = 1, FullName = "Data Tester", Email = "dt@g.com", Phone = "123" };

            // Act
            context.Members.Add(member);
            await context.SaveChangesAsync();

            // Assert
            var saved = await context.Members.FindAsync(1);
            Assert.NotNull(saved);
            Assert.Equal("Data Tester", saved.FullName);
        }

        [Fact]
        public async Task Relationship_MapsManyToManyCorrectly()
        {
            // Arrange
            using var context = GetDbContext();

            var member = new Member { MemberId = 10, FullName = "Gym Member", Email = "m@g.com", Phone = "1" };
            var trainer = new Trainer { TrainerId = 5, FullName = "Trainer Coach", Speciality = "Pilates", Phone = "2" };

            context.Members.Add(member);
            context.Trainers.Add(trainer);
            await context.SaveChangesAsync();

            // Act 
            var bridge = new MemberTrainer { MemberId = 10, TrainerId = 5 };
            context.MemberTrainers.Add(bridge);
            await context.SaveChangesAsync();

            // Assert
            var savedBridge = await context.MemberTrainers
                .FirstOrDefaultAsync(mt => mt.MemberId == 10 && mt.TrainerId == 5);

            Assert.NotNull(savedBridge);
            Assert.Equal(10, savedBridge.MemberId);
            Assert.Equal(5, savedBridge.TrainerId);
        }

        [Fact]
        public async Task Schema_EnforcesPrimaryKeyConstraints()
        {
            // Arrange
            using var context = GetDbContext();
            var member1 = new Member { MemberId = 100, FullName = "First", Email = "f@g.com", Phone = "1" };
            var member2 = new Member { MemberId = 100, FullName = "Duplicate Key", Email = "dup@g.com", Phone = "2" };

            context.Members.Add(member1);
            await context.SaveChangesAsync();

            // Act & Assert 
            // FIX: Asserts that the tracker immediately rejects tracking a duplicate key instance
            Assert.Throws<InvalidOperationException>(() =>
                context.Members.Add(member2)
            );
        }
    }
}