using FoodCalorie.Models;

namespace FoodCalorie.DTOs
{
    public class UserHistoryResponseWithImage
    {
        public List<History> Histories { get; set; }
        public List<AnalysisHistoryWithImage> AnalysisHistories { get; set; }
    }
}
