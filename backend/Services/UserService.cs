using MongoDB.Driver;
using FoodCalorie.Models;
using FoodCalorie.DTOs;
using Microsoft.Extensions.Options;


namespace FoodCalorie.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IOptions<MongoDBSettings> dbSettings, IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _users = database.GetCollection<User>("Users"); 
    }


    public async Task<CradentialVaildation>Validation(CradentialVaildation cr)
    {
        var existingUser = await _users.Find(u => u.email == cr.Email).FirstOrDefaultAsync();
        if (existingUser != null)
            throw new Exception("user eixst");

        return cr;
    }

    public async Task<User> RegisterUserAsync(RegisterRequest request)
    {
       

         request.UserData.Password = BCrypt.Net.BCrypt.HashPassword(request.UserData.Password);

        var user = new User
        {
            Name = request.UserData.Name,
            email = request.UserData.Email,
            password = request.UserData.Password,
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
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<User?> GetUserByNameAsync(string email)
    {
        return await _users.Find(u => u.email == email).FirstOrDefaultAsync();
    }
}
