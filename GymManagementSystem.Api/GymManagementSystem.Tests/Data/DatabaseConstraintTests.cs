using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Data
{
    public class DatabaseConstraintTests : IDisposable
    {
        private readonly SqliteConnection _connection;
        private readonly DbContextOptions<AppDbContext> _contextOptions;

        public DatabaseConstraintTests()
        {
            _connection = new SqliteConnection("Filename=:memory:");
            _connection.Open();

            _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(_connection)
                .Options;
        }

        private AppDbContext GetSqliteDbContext()
        {
            var context = new AppDbContext(_contextOptions);

            context.Database.EnsureCreated();
            return context;
        }

        [Fact]
        public async Task Database_ForeignKeyConstraint_EnforcedSuccessfully()
        {
            using var context = GetSqliteDbContext();

            var orphanedPayment = new Payment
            {
                PaymentId = 1,
                MemberId = 9999,
                Amount = 50m,
                Method = "Cash",
                Date = DateTime.Now
            };

            context.Payments.Add(orphanedPayment);

            await Assert.ThrowsAsync<DbUpdateException>(async () =>
                await context.SaveChangesAsync()
            );
        }

        public void Dispose()
        {
            _connection.Dispose();
        }
    }
}