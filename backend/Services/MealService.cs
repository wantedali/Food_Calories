using FoodCalorie.DTOs;
using FoodCalorie.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FoodCalorie.Services;

public static class MealService
{
    
    public static void AddFood(Meal meal,foodDto food)
    {
        var fd = new Food
        {
            Name = food.Name,
            Calories = food.Calories,
            Protein = food.Protein,
            Carbs = food.Carbs,
            Fat = food.Fat,
            Weight = food.Weight
        };
        meal.Items.Add(fd);
        meal.TotalCalories += food.Calories;
        meal.TotalProtein += food.Protein;
        meal.TotalCarbs += food.Carbs;
        meal.TotalFat += food.Fat;
    }

    public static void RemoveFood(Meal meal,Food food)
    {
        meal.TotalCalories -= food.Calories;
        meal.TotalProtein -= food.Protein;
        meal.TotalCarbs -= food.Carbs;
        meal.TotalFat -= food.Fat;
        meal.Items.Remove(food);
        
    }
    
}
