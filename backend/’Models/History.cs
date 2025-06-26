
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FoodCalorie.Models;

public class History
{
    [BsonId]
    public ObjectId Id { get; set; }

    public string UserId { get; set; }
    public string MealName { get; set; }

    public float Calories { get; set; }

    public float Protein { get; set; }

    public float Carbs { get; set; }

    public float Fat { get; set; }

    



}
