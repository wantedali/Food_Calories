using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FoodCalorie.Models;
public class Food
{

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Name { get; set; } = string.Empty;
    public double Calories { get; set; }
    public double Protein { get; set; }
    public double Carbs { get; set; }
    public double Fat { get; set; }
    public double Weight { get; set; }
}