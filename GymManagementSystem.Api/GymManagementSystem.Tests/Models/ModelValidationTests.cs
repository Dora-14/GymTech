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



        [Fact]
        public void Member_PhoneTooShort_FailsValidation()
        {

            var member = new Member
            {
                FullName = "Valid Name",
                Email = "test@gym.com",
                Phone = "12345"
            };

            var errors = ValidateModel(member);

            Assert.NotEmpty(errors);
            Assert.Contains(errors, e => e.ErrorMessage.Contains("Phone number must be between 10 and 15 characters"));
        }

        [Fact]
        public void Subscription_ValidData_PassesValidation()
        {

            var subscription = new Subscription
            {
                Type = "Standard",
                Price = 150.00m,
                DurationDays = 30,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(30)
            };


            var errors = ValidateModel(subscription);


            Assert.Empty(errors);
        }

        [Theory]
        [InlineData(0.00)]
        [InlineData(-10.50)]
        public void Subscription_PriceZeroOrNegative_FailsValidation(decimal invalidPrice)
        {
            var subscription = new Subscription
            {
                Type = "Premium",
                Price = invalidPrice,
                DurationDays = 90
            };

            var errors = ValidateModel(subscription);

            Assert.NotEmpty(errors);
            Assert.Contains(errors, e => e.ErrorMessage.Contains("Prețul trebuie să fie mai mare de 0!"));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(400)]
        public void Subscription_DurationOutOfRange_FailsValidation(int invalidDuration)
        {
            var subscription = new Subscription
            {
                Type = "Basic",
                Price = 50.00m,
                DurationDays = invalidDuration
            };

            var errors = ValidateModel(subscription);

            Assert.NotEmpty(errors);
            Assert.Contains(errors, e => e.ErrorMessage.Contains("Durata trebuie să fie între 1 și 365 de zile!"));
        }
    }
}
