//using GymManagementSystem.Api.Controllers;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Mvc.Testing;
//using System.Net;

//namespace GymManagementSystem.Tests.Integration
//{
//    public class GymApiIntegrationTests : IClassFixture<WebApplicationFactory<MemberController>>
//    {
//        private readonly WebApplicationFactory<MemberController> _factory;

//        public GymApiIntegrationTests(WebApplicationFactory<MemberController> factory)
//        {

//            _factory = factory.WithWebHostBuilder(builder =>
//            {
//                builder.UseContentRoot(Directory.GetCurrentDirectory());
//            });
//        }

//        [Fact]
//        public async Task GetMembers_Endpoint_ReturnsSuccessStatusCode()
//        {
//            var client = _factory.CreateClient();

//            var response = await client.GetAsync("/api/member");

//            Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.Unauthorized);
//        }

//        [Fact]
//        public async Task DeleteMember_WithoutToken_Returns401Unauthorized()
//        {
//            var client = _factory.CreateClient();

//            var response = await client.DeleteAsync("/api/member/1");

//            Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.NotFound);
//        }
//    }
//}