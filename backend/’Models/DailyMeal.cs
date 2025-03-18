
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FoodCalorie.Models;

public class DailyMeal
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string UserId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public Meal Breakfast { get; set; } = new Meal();
    public Meal Lunch { get; set; } = new Meal();
    public Meal Dinner { get; set; } = new Meal();

    public double TotalCalories ;
    public double TotalProtein ;
    public double TotalCarbs ;
    public double TotalFat ;
}
