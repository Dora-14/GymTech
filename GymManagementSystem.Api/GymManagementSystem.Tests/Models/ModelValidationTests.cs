using GymManagementSystem.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace GymManagementSystem.Tests.Models
{
    public class ModelValidationTests
    {

        private IList<ValidationResult> ValidateModel(object model)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(model, serviceProvider: null, items: null);
            Validator.TryValidateObject(model, context, validationResults, validateAllProperties: true);
            return validationResults;
        }

        [Fact]
        public async Task UserAccount_DefaultRole_IsAdmin()
        {
            var account = new UserAccount();

            Assert.Equal("Admin", account.Role);
        }

        [Fact]
        public async Task Member_ValidData_PassesValidation()
        {
            var member = new Member
            {
                MemberId = 1,
                FullName = "John Doe",
                Email = "john@gym.com",
                Phone = "0712345678"
            };

            var errors = ValidateModel(member);

            Assert.Empty(errors);
        }

        [Fact]
        public async Task Member_MissingRequiredFields_FailsValidation()
        {
            var member = new Member
            {
                MemberId = 1,
                FullName = string.Empty
            };

            var errors = ValidateModel(member);

            Assert.NotNull(errors);
        }

        [Fact]
        public async Task Member_InvalidEmail_FailsValidation()
        {
            var member = new Member
            {
                MemberId = 1,
                FullName = "Valid Name",
                Email = "not-an-email-address",
                Phone = "12345"
            };

            var errors = ValidateModel(member);

            Assert.NotEmpty(errors);
        }

        [Fact]
        public async Task Member_PhoneTooLong_FailsValidation()
        {
            var member = new Member
            {
                MemberId = 1,
                FullName = "Valid Name",
                Email = "test@gym.com",
                Phone = new string('9', 50)
            };

            var errors = ValidateModel(member);

            Assert.NotEmpty(errors);
        }
    }
}
