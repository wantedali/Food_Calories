namespace FoodCalorie.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public enum Gender { Male = 0, Female = 1 }
public enum Goal { Maintain = 1 , Gain = 2, Lose = 0 }
public enum HowFast { Slow =0, Moderate=1, Fast = 2}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = ObjectId.GenerateNewId().ToString(); 

    public string Name { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string password { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public double ActivityLevel { get; set; }
    public int Age { get; set; }
    public double Weight { get; set; }
    public double Height { get; set; }
    public Goal Goal { get; set; } = Goal.Maintain;
    public HowFast HowFast { get; set; } = HowFast.Moderate;

    [BsonIgnoreIfDefault] 
    public double BodyFat { get; set; } = 0;

    public double BMR { get; set; }
    public double TDEE { get; set; }
    public double CalorieGoal { get; set; }

    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    // Stores daily meals (Breakfast, Lunch, Dinner) for **today**
    public DailyMeal TodayMeals { get; set; } = new DailyMeal();

    // Stores only the last 7 days of meals
    private List<DailyMeal> _mealHistory = new List<DailyMeal>();

   
   
}
