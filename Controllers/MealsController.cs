using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")] // 🔹 ده معناه إن الـ Endpoint هيبقى "/api/meals"
public class MealsController : ControllerBase
{
    private static List<Meal> meals = new();

    // 🔥 GET: api/meals
    [HttpGet]
    public IActionResult GetMeals()
    {
        return Ok(meals);
    }

    // 🔥 POST: api/meals
    [HttpPost]
    public IActionResult AddMeal([FromBody] Meal meal)
    {
        meals.Add(meal);
        return CreatedAtAction(nameof(GetMeals), new { id = meal.Id }, meal);
    }
}

public record Meal(int Id,string name,int calorie);