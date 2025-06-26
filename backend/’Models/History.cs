
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FoodCalorie.Models;

public class History
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string UserId { get; set; }
    public string MealName { get; set; }

    public float Calories { get; set; }

    public float Protein { get; set; }

    public float Carbs { get; set; }

    public float Fat { get; set; }
    public float Wieght { get; set; }

    public DateTime date { get; set; } = DateTime.UtcNow;



}
