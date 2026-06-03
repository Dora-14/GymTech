using GymManagementSystem.Api.Models;
using GymManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> PostPayment(Payment payment)
        {
            try
            {
                var result = await _paymentService.AddPaymentAsync(payment);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetMemberHistory(int memberId)
        {
            var payments = await _paymentService.GetMemberPaymentsAsync(memberId);
            return Ok(payments);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _paymentService.GetAllAsync());
        }
    }
}