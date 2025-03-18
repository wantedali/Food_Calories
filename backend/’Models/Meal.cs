namespace FoodCalorie.Models;

public class Meal
{
    public List<Food> Items { get; set; } = new List<Food>();

    public double TotalCalories;
    public double TotalProtein;
    public double TotalCarbs;
    public double TotalFat;
}