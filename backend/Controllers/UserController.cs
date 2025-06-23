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
    private readonly TokenService _tokenService;

    public UserController(UserService userService, TokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    [HttpPost("EmailValidation")]
    public async Task<IActionResult> Evalidation([FromBody] CradentialVaildation request)
    {
        try
        {
            var newUser = await _userService.Validation(request);
            return Ok(new { message = "every thing is ok", user = newUser });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
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

    /*[HttpPost("test-cal")]
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
    }*/

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest dto)
    {

       
        var user = await _userService.GetUserByNameAsync(dto.Email);
        if (user == null)
            return Unauthorized("Invalid email or password");

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.password);
        if (!isPasswordValid)
            return Unauthorized($"Invalid email or password ");

        var token = _tokenService.GenerateToken(user); 
        return Ok(new { token });
    }

}
