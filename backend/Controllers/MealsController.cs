﻿using FoodCalorie.DTOs;
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
                return Ok(new{ Message = "food added"});
            }
            catch (Exception ex) { 
                 return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("remove-food")]
        public async Task<IActionResult> RemoveFood([FromQuery] string userId, [FromQuery] string mealType, [FromQuery] string foodId)
        {
            try
            {
                var updatedUser = await daily.RemoveFood(userId, foodId , mealType);
                return Ok(new { message = "Food removed"});
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("Get-Meals")]
        public async Task<IActionResult>getMeals(string userid)
        {
            try
            {
                var meals = await daily.GetMeals(userid);
                return Ok(new {daily = meals});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
