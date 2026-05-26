using GymManagementSystem.Api.Controllers;
using GymManagementSystem.Api.Data;
using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManagementSystem.Tests.Controllers
{
    public class MembersControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"GymTestDb_{Guid.NewGuid()}")
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task GetAll_Returns200()
        {
            using var context = GetInMemoryDbContext();

            context.Members.AddRange(new List<Member>
            {
                new Member { MemberId = 1, FullName = "Test Member 1", Email = "test1@gym.com", Phone = "0711111111" },
                new Member { MemberId = 2, FullName = "Test Member 2", Email = "test2@gym.com", Phone = "0722222222" }
            });
            await context.SaveChangesAsync();

            var memberService = new MemberService(context);
            var controller = new MemberController(memberService);

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedMembers = Assert.IsAssignableFrom<IEnumerable<Member>>(okResult.Value);
            Assert.NotEmpty(returnedMembers);
        }


        [Fact]
        public async Task GetById_ValidId_Returns200()
        {
            using var context = GetInMemoryDbContext();
            context.Members.Add(new Member { MemberId = 10, FullName = "John", Email = "j@g.com", Phone = "1" });
            await context.SaveChangesAsync();

            var controller = new MemberController(new MemberService(context));

            var result = await controller.GetMember(10);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var member = Assert.IsType<Member>(okResult.Value);
            Assert.Equal("John", member.FullName);
        }

        [Fact]
        public async Task GetById_InvalidId_Returns404()
        {
            using var context = GetInMemoryDbContext();
            var controller = new MemberController(new MemberService(context));

            var result = await controller.GetMember(999);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ValidMember_Returns201()
        {
            using var context = GetInMemoryDbContext();
            var controller = new MemberController(new MemberService(context));
            var newMember = new Member { MemberId = 3, FullName = "New Guy", Email = "n@g.com", Phone = "2" };

            var result = await controller.Create(newMember);

            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async Task Delete_ExistingMember_Returns204()
        {
            using var context = GetInMemoryDbContext();
            context.Members.Add(new Member { MemberId = 5, FullName = "To Delete", Email = "d@g.com", Phone = "3" });
            await context.SaveChangesAsync();

            var controller = new MemberController(new MemberService(context));
            var result = await controller.Delete(5);

            Assert.IsType<NoContentResult>(result);
        }
    }
}
