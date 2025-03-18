using MongoDB.Driver;
using FoodCalorie.Models;
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

    public async Task<User> RegisterUserAsync(User user)
    {
        var existingUser = await _users.Find(u => u.email == user.email).FirstOrDefaultAsync();
        if (existingUser != null)
            throw new Exception("user eixst");

        CalorieCalculator.finalCalorie(user);
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<User?> GetUserByNameAsync(string name)
    {
        return await _users.Find(u => u.Name == name).FirstOrDefaultAsync();
    }
}
