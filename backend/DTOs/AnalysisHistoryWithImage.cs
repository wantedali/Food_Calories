namespace FoodCalorie.DTOs
{
    public class AnalysisHistoryWithImage
    {
        public string Id { get; set; }
        public string MealName { get; set; }
        public float Calories { get; set; }
        public float Protein { get; set; }
        public float Carbs { get; set; }
        public float Fat { get; set; }
        public string ImageBase64 { get; set; }
        public string ImageContentType { get; set; }
    }
}
