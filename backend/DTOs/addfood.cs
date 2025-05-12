using FoodCalorie.Models;


namespace FoodCalorie.DTOs
{
    public class addfood
    {

        public string UserId { get; set; }

        public string TypeOfMeal { get; set; }

        public Food food { get; set; }
    }
}
