using FoodCalorie.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FoodCalorie.Services;

public static class MealService
{
    
    public static void AddFood(Meal meal,Food food)
    {
        meal.Items.Add(food);
        meal.TotalCalories += food.Calories;
        meal.TotalProtein += food.Protein;
        meal.TotalCarbs += food.Carbs;
        meal.TotalFat += food.Fat;
    }

    public static void RemoveFood(Meal meal,Food food)
    {
        meal.Items.Remove(food);
        meal.TotalCalories -= food.Calories;
        meal.TotalProtein -= food.Protein;
        meal.TotalCarbs -= food.Carbs;
        meal.TotalFat -= food.Fat;
    }
    
}
