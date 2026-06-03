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
            using var context = GetDbContext();
            var member = new Member { MemberId = 1, FullName = "Data Tester", Email = "dt@g.com", Phone = "123" };

            context.Members.Add(member);
            await context.SaveChangesAsync();

            var saved = await context.Members.FindAsync(1);
            Assert.NotNull(saved);
            Assert.Equal("Data Tester", saved.FullName);
        }

        [Fact]
        public async Task Relationship_MapsManyToManyCorrectly()
        {
            using var context = GetDbContext();

            var member = new Member { MemberId = 10, FullName = "Gym Member", Email = "m@g.com", Phone = "1" };
            var trainer = new Trainer { TrainerId = 5, FullName = "Trainer Coach", Speciality = "Pilates", Phone = "2" };

            context.Members.Add(member);
            context.Trainers.Add(trainer);
            await context.SaveChangesAsync();

            var bridge = new MemberTrainer { MemberId = 10, TrainerId = 5 };
            context.MemberTrainers.Add(bridge);
            await context.SaveChangesAsync();

            var savedBridge = await context.MemberTrainers
                .FirstOrDefaultAsync(mt => mt.MemberId == 10 && mt.TrainerId == 5);

            Assert.NotNull(savedBridge);
            Assert.Equal(10, savedBridge.MemberId);
            Assert.Equal(5, savedBridge.TrainerId);
        }

        [Fact]
        public async Task Schema_EnforcesPrimaryKeyConstraints()
        {
            using var context = GetDbContext();
            var member1 = new Member { MemberId = 100, FullName = "First", Email = "f@g.com", Phone = "1" };
            var member2 = new Member { MemberId = 100, FullName = "Duplicate Key", Email = "dup@g.com", Phone = "2" };

            context.Members.Add(member1);
            await context.SaveChangesAsync();

            Assert.Throws<InvalidOperationException>(() =>
                context.Members.Add(member2)
            );
        }


        [Fact]
        public async Task Schema_OneToManyRelationship_LoadsNavigationProperties()
        {
            using var context = GetDbContext();
            int targetMemberId = 77;

            var member = new Member { MemberId = targetMemberId, FullName = "Bob Builder", Email = "bob@g.com", Phone = "0" };
            var subscription = new Subscription { SubscriptionId = 500, MemberId = targetMemberId, StartDate = DateTime.Now, EndDate = DateTime.Now };
            var payment = new Payment { PaymentId = 900, MemberId = targetMemberId, Amount = 100m, Date = DateTime.Now, Method = "Cash" };

            context.Members.Add(member);
            context.Subscriptions.Add(subscription);
            context.Payments.Add(payment);
            await context.SaveChangesAsync();

            var fetchedMember = await context.Members
                .Include(m => m.Subscriptions)
                .Include(m => m.Payments)
                .FirstOrDefaultAsync(m => m.MemberId == targetMemberId);

            Assert.NotNull(fetchedMember);
            Assert.Single(fetchedMember.Subscriptions);
            Assert.Single(fetchedMember.Payments);
        }

        [Fact]
        public async Task Schema_CompositeKeyDuplication_ThrowsInvalidOperationException()
        {
            using var context = GetDbContext();
            var bridge1 = new MemberTrainer { MemberId = 1, TrainerId = 1 };
            var bridge2 = new MemberTrainer { MemberId = 1, TrainerId = 1 };

            context.MemberTrainers.Add(bridge1);
            await context.SaveChangesAsync();

            Assert.Throws<InvalidOperationException>(() =>
                context.MemberTrainers.Add(bridge2)
            );
        }

        [Fact]
        public async Task Schema_UpdateDetachedEntity_UpdatesSuccessfully()
        {
            using var context = GetDbContext();
            var user = new UserAccount { UserId = 45, Username = "initial", Email = "i@g.com", PasswordHash = "1" };
            context.AdminUsers.Add(user);
            await context.SaveChangesAsync();

            context.Entry(user).State = EntityState.Detached;

            user.Username = "mutated_state";
            context.AdminUsers.Update(user);
            await context.SaveChangesAsync();

            var verifiedRecord = await context.AdminUsers.FindAsync(45);
            Assert.NotNull(verifiedRecord);
            Assert.Equal("mutated_state", verifiedRecord.Username);
        }
    }
}