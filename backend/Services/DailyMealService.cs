using System.Threading.Tasks;
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
        foodDto food = newfood.food;
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

   
     public async Task<User> RemoveFood(string userId, string foodId, string mealType)
     {
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) throw new Exception("User not found");

        Meal meal = mealType.ToLower() switch
        {
            "breakfast" => user.TodayMeals.Breakfast,
            "lunch" => user.TodayMeals.Lunch,
            "dinner" => user.TodayMeals.Dinner,
            _ => throw new ArgumentException("Invalid meal type")
        };

        var food = meal.Items.FirstOrDefault(f => f.Id == foodId);
        if (food == null) throw new Exception("Food not found");

        MealService.RemoveFood(meal, food);


        user.TodayMeals.TotalCalories = user.TodayMeals.Breakfast.TotalCalories + user.TodayMeals.Lunch.TotalCalories + user.TodayMeals.Dinner.TotalCalories;
        user.TodayMeals.TotalProtein = user.TodayMeals.Breakfast.TotalProtein + user.TodayMeals.Lunch.TotalProtein + user.TodayMeals.Dinner.TotalProtein;
        user.TodayMeals.TotalCarbs = user.TodayMeals.Breakfast.TotalCarbs + user.TodayMeals.Lunch.TotalCarbs + user.TodayMeals.Dinner.TotalCarbs;
        user.TodayMeals.TotalFat = user.TodayMeals.Breakfast.TotalFat + user.TodayMeals.Lunch.TotalFat + user.TodayMeals.Dinner.TotalFat;

        await _users.ReplaceOneAsync(u => u.Id == userId, user);
        return user;
    }


    public async Task<DailyMeal> GetMeals(string userId)
    {

        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) throw new Exception("user not found");
        return user.TodayMeals;

    }

}


