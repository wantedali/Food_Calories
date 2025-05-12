using FoodCalorie.DTOs;
using FoodCalorie.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FoodCalorie.Services;

public class DailyMealService
{
    private readonly IMongoCollection<User> _users;

    public DailyMealService(IOptions<MongoDBSettings> dbSettings, IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _users = database.GetCollection<User>("Users");
    }
    public async Task<User> AddFood(addfood newfood)
    {
        String userId = newfood.UserId;
        Food food = newfood.food;
        string type = newfood.TypeOfMeal;


        var user =  await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) throw new Exception("User not found");

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
        user.TodayMeals.TotalProtein = user.TodayMeals.Breakfast.TotalProtein + user.TodayMeals.Lunch.TotalProtein + user.TodayMeals.Dinner.TotalProtein;
        user.TodayMeals.TotalCarbs = user.TodayMeals.Breakfast.TotalCarbs + user.TodayMeals.Lunch.TotalCarbs + user.TodayMeals.Dinner.TotalCarbs;
        user.TodayMeals.TotalFat = user.TodayMeals.Breakfast.TotalFat + user.TodayMeals.Lunch.TotalFat + user.TodayMeals.Dinner.TotalFat;
        user.TodayMeals.TotalCalories = user.TodayMeals.Breakfast.TotalCalories + user.TodayMeals.Lunch.TotalCalories + user.TodayMeals.Dinner.TotalCalories;
        await _users.ReplaceOneAsync(u => u.Id == userId, user);
        return user;
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
