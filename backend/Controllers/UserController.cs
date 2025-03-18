using Microsoft.AspNetCore.Mvc;
using FoodCalorie.Services;
using FoodCalorie.Models;

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
    public async Task<IActionResult> Register([FromBody] User user)
    {
        try
        {
            var newUser = await _userService.RegisterUserAsync(user);
            return Ok(new { message = "register Done", user = newUser });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{name}")]
    public async Task<IActionResult> GetUser(string name)
    {
        var user = await _userService.GetUserByNameAsync(name);
        if (user == null)
            return NotFound(new { message = "user not found" });

        return Ok(user);
    }
}
