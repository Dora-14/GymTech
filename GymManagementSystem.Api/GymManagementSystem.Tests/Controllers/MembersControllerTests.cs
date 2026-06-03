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


        [Fact]
        public async Task Update_ExistingMember_Returns200Ok()
        {

            using var context = GetInMemoryDbContext();
            var originalMember = new Member { MemberId = 20, FullName = "Old Name", Email = "old@gym.com", Phone = "123" };
            context.Members.Add(originalMember);
            await context.SaveChangesAsync();

            var controller = new MemberController(new MemberService(context));
            var updatedPayload = new Member { MemberId = 20, FullName = "Brand New Name", Email = "new@gym.com", Phone = "999" };


            var result = await controller.Update(20, updatedPayload);


            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedMember = Assert.IsType<Member>(okResult.Value);
            Assert.Equal("Brand New Name", returnedMember.FullName);


            var dbMember = await context.Members.FindAsync(20);
            Assert.Equal("new@gym.com", dbMember.Email);
        }

        [Fact]
        public async Task Update_NonExistentMember_Returns404NotFound()
        {

            using var context = GetInMemoryDbContext();
            var controller = new MemberController(new MemberService(context));
            var updatedPayload = new Member { MemberId = 99, FullName = "Ghost", Email = "g@g.com", Phone = "0" };


            var result = await controller.Update(99, updatedPayload);


            Assert.IsType<NotFoundObjectResult>(result);
        }



        [Fact]
        public async Task Search_ValidQuery_ReturnsOkWithMatches()
        {
            using var context = GetInMemoryDbContext();
            context.Members.AddRange(
                new Member { MemberId = 30, FullName = "Alex Gymgoer", Email = "alex@g.com", Phone = "1" },
                new Member { MemberId = 31, FullName = "Bob Smith", Email = "bob@g.com", Phone = "2" }
            );
            await context.SaveChangesAsync();

            var controller = new MemberController(new MemberService(context));


            var result = await controller.Search("Alex");


            var okResult = Assert.IsType<OkObjectResult>(result);
            var results = Assert.IsAssignableFrom<IEnumerable<Member>>(okResult.Value);
            Assert.Single(results);
        }

        [Fact]
        public async Task Search_EmptyQuery_Returns400BadRequest()
        {

            using var context = GetInMemoryDbContext();
            var controller = new MemberController(new MemberService(context));


            var result = await controller.Search("   ");


            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetAll_EmptyDatabase_Returns200WithEmptyList()
        {

            using var context = GetInMemoryDbContext();
            var controller = new MemberController(new MemberService(context));


            var result = await controller.GetAll();


            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedMembers = Assert.IsAssignableFrom<IEnumerable<Member>>(okResult.Value);
            Assert.Empty(returnedMembers);
        }
    }
}
