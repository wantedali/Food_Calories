namespace FoodCalorie.DTOs
{
    public class AnalysisHistoryForm
    {
        public IFormFile Image { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string MealName { get; set; } = null!;
        public float Calories { get; set; }
        public float Protein { get; set; }
        public float Carbs { get; set; }
        public float Fat { get; set; }
    }
}
