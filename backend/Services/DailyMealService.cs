using FoodCalorie.Models;

namespace FoodCalorie.Services;

public class DailyMealService
{
    public void AddFood(User user, Food food, string type)
    {
        switch (type.ToLower()) // Ensure case insensitivity
        {
            case "breakfast":
                MealService.AddFood(user.TodayMeals.Breakfast, food);
                break;
            case "lunch":
                MealService.AddFood(user.TodayMeals.Lunch, food);
                break;
            case "dinner":
                MealService.AddFood(user.TodayMeals.Dinner, food);
                break;
            default:
                throw new ArgumentException("Invalid meal type. Use 'breakfast', 'lunch', or 'dinner'.");
        }
    }

    public void RemoveFood(User user, Food food, string type)
    {
        switch (type.ToLower()) // Ensure case insensitivity
        {
            case "breakfast":
                MealService.RemoveFood(user.TodayMeals.Breakfast, food);
                break;
            case "lunch":
                MealService.RemoveFood(user.TodayMeals.Lunch, food);
                break;
            case "dinner":
                MealService.RemoveFood(user.TodayMeals.Dinner, food);
                break;
            default:
                throw new ArgumentException("Invalid meal type. Use 'breakfast', 'lunch', or 'dinner'.");
        }
    }

}
