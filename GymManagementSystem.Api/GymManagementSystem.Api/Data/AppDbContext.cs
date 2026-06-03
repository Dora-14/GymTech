using GymManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Member> Members { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<MemberTrainer> MemberTrainers { get; set; }
        public DbSet<UserAccount> AdminUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<MemberTrainer>()
                .HasKey(mt => new { mt.MemberId, mt.TrainerId });
        }
    }

}