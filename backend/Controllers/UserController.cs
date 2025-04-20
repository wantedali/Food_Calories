using Microsoft.AspNetCore.Mvc;
using FoodCalorie.Services;
using FoodCalorie.Models;
using FoodCalorie.DTOs;

namespace FoodCalorie.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var newUser = await _userService.RegisterUserAsync(request);
            return Ok(new { message = "register Done", user = newUser });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("test-cal")]
    public  IActionResult testcalc([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            Name = request.Name,
            email = request.Email,
            password = request.Password,
            Gender = request.Gender,
            ActivityLevel = request.ActivityLevel,
            Age = request.Age,
            Weight = request.Weight,
            Height = request.Height,
            Goal = request.Goal,
            HowFast = request.HowFast,
            BodyFat = request.BodyFat ?? 0
        };

        user.CalorieGoal = CalorieCalculator.finalCalorie(user);

        return Ok(new { user.BMR, user.TDEE, user.CalorieGoal });
    }

    /*[HttpGet("{Login}")]
    public async Task<IActionResult> GetUser(string email , string password)
    {
        var user = await _userService.GetUserByNameAsync();
        if (user == null)
            return NotFound(new { message = "user not found" });

        return Ok(user);
    }*/
}
