using FoodCalorie.DTOs;
using FoodCalorie.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodCalorie.Controllers
{
    [ApiController]
    [Route("api/Meals")]
    public class MealsController : Controller
    {
        private readonly DailyMealService daily;
        
        public MealsController (DailyMealService daily)
        {
            this.daily = daily;
        }


        [HttpPost("AddMeal")]
        public async Task<IActionResult> AddMeal([FromBody] addfood request)
        {
            try
            {
                var newUser = await daily.AddFood(request);
                return Ok(new { message = "food Added sucssecfully!", user = newUser });
            }
            catch (Exception ex) { 
                 return BadRequest(new { error = ex.Message });
            }
        }


    }
}
