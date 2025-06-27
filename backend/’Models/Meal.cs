namespace FoodCalorie.Models;

public class Meal
{
    public List<Food> Items { get; set; } = new List<Food>();

    public double TotalCalories { get; set; }
    public double TotalProtein { get; set; }
    public double TotalCarbs { get; set; }
    public double TotalFat { get; set; }
}