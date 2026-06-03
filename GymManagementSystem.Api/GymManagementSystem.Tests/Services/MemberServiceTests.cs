using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Services
{
    public class MemberServiceTests
    {
        private AppDbContext GetDbContext() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase($"MemberServiceDb_{Guid.NewGuid()}").Options);

        [Fact]
        public async Task GetAll_ReturnsAllRecords()
        {
            using var context = GetDbContext();
            context.Members.AddRange(new List<Member>
            {
                new Member { MemberId = 1, FullName = "A", Email = "a@g.com", Phone = "1" },
                new Member { MemberId = 2, FullName = "B", Email = "b@g.com", Phone = "2" }
            });
            await context.SaveChangesAsync();

            var service = new MemberService(context);

            var results = await service.GetAllAsync();

            Assert.Equal(2, results.Count);
        }

        [Fact]
        public async Task GetById_IncludesRelations()
        {
            using var context = GetDbContext();
            var member = new Member { MemberId = 5, FullName = "Charlie", Email = "c@g.com", Phone = "3" };
            context.Members.Add(member);

            context.Subscriptions.Add(new Subscription { SubscriptionId = 1, MemberId = 5, StartDate = DateTime.Now, EndDate = DateTime.Now });
            context.Payments.Add(new Payment { PaymentId = 1, MemberId = 5, Amount = 50, Date = DateTime.Now, Method = "Card" });
            await context.SaveChangesAsync();

            var service = new MemberService(context);

            var result = await service.GetByIdAsync(5);

            Assert.NotNull(result);
            Assert.Single(result.Subscriptions);
            Assert.Single(result.Payments);
        }

        [Fact]
        public async Task Add_SavesDatabaseRecord()
        {
            using var context = GetDbContext();
            var service = new MemberService(context);
            var member = new Member { MemberId = 10, FullName = "New User", Email = "n@g.com", Phone = "4" };

            var result = await service.AddAsync(member);

            var saved = await context.Members.FindAsync(10);
            Assert.NotNull(saved);
            Assert.Equal("New User", saved.FullName);
        }


        [Fact]
        public async Task UpdateById_ModifiesProperties()
        {
            using var context = GetDbContext();
            context.Members.Add(new Member { MemberId = 30, FullName = "Before", Email = "b@g.com", Phone = "6" });
            await context.SaveChangesAsync();

            var service = new MemberService(context);
            var modifications = new Member { FullName = "After", Email = "after@g.com", Phone = "7" };

            var result = await service.UpdateAsync(30, modifications);

            Assert.NotNull(result);
            Assert.Equal("After", result.FullName);
            Assert.Equal("after@g.com", result.Email);
        }

        [Fact]
        public async Task UpdateById_InvalidId_ReturnsNull()
        {
            using var context = GetDbContext();
            var service = new MemberService(context);
            var modifications = new Member { FullName = "Ghost" };

            var result = await service.UpdateAsync(999, modifications);

            Assert.Null(result);
        }

        [Fact]
        public async Task Delete_RemovesRecord()
        {
            using var context = GetDbContext();
            context.Members.Add(new Member { MemberId = 40, FullName = "To Delete", Email = "d@g.com", Phone = "8" });
            await context.SaveChangesAsync();

            var service = new MemberService(context);

            await service.DeleteAsync(40);

            var saved = await context.Members.FindAsync(40);
            Assert.Null(saved);
        }


        [Fact]
        public async Task Search_MatchesFullNameAndEmail_ReturnsCorrectMembers()
        {
            // Arrange
            using var context = GetDbContext();
            context.Members.AddRange(new List<Member>
            {
                new Member { MemberId = 100, FullName = "John Cena", Email = "invisible@gym.com", Phone = "1" },

                new Member { MemberId = 101, FullName = "Regular Guy", Email = "cena_fan@g.com", Phone = "2" },
                new Member { MemberId = 102, FullName = "Jane Smith", Email = "jane@g.com", Phone = "3" }
            });
            await context.SaveChangesAsync();

            var service = new MemberService(context);

            var results = await service.SearchAsync("CENA");

            Assert.Equal(2, results.Count);
            Assert.Contains(results, m => m.FullName == "John Cena");
            Assert.Contains(results, m => m.Email == "cena_fan@g.com");
        }

        [Fact]
        public async Task Search_NoMatchesExist_ReturnsEmptyList()
        {
            using var context = GetDbContext();
            context.Members.Add(new Member { MemberId = 1, FullName = "John", Email = "j@g.com", Phone = "0" });
            await context.SaveChangesAsync();

            var service = new MemberService(context);

            var results = await service.SearchAsync("NotPresentInDB");

            Assert.NotNull(results);
            Assert.Empty(results);
        }



        [Fact]
        public async Task GetById_NonExistentMember_ReturnsNull()
        {
            using var context = GetDbContext();
            var service = new MemberService(context);

            var result = await service.GetByIdAsync(404);

            Assert.Null(result);
        }

        [Fact]
        public async Task Delete_NonExistentMember_DoesNotThrow()
        {
            using var context = GetDbContext();
            var service = new MemberService(context);

            var exception = await Record.ExceptionAsync(() => service.DeleteAsync(999));
            Assert.Null(exception);
        }
    }
}