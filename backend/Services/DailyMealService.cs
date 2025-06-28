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

        RecalculateTotals(user.TodayMeals);

       
       
        var update = Builders<User>.Update.Set(u => u.TodayMeals, user.TodayMeals);
        await _users.UpdateOneAsync(u => u.Id == userId, update);
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

        RecalculateTotals(user.TodayMeals);
        
        var update = Builders<User>.Update.Set(u => u.TodayMeals, user.TodayMeals);
        await _users.UpdateOneAsync(u => u.Id == userId, update);

        return user;
    }


    public async Task<DailyMeal> GetMeals(string userId)
    {

        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) throw new Exception("user not found");
        return user.TodayMeals;

    }


    private void RecalculateTotals(DailyMeal meals)
    {
        meals.TotalCalories = meals.Breakfast.TotalCalories + meals.Lunch.TotalCalories + meals.Dinner.TotalCalories;
        meals.TotalProtein = meals.Breakfast.TotalProtein + meals.Lunch.TotalProtein + meals.Dinner.TotalProtein;
        meals.TotalCarbs = meals.Breakfast.TotalCarbs + meals.Lunch.TotalCarbs + meals.Dinner.TotalCarbs;
        meals.TotalFat = meals.Breakfast.TotalFat + meals.Lunch.TotalFat + meals.Dinner.TotalFat;
    }

}


