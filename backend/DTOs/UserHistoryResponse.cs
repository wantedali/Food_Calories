using FoodCalorie.Models;

namespace FoodCalorie.DTOs
{
    public class UserHistoryResponse
    {
        public List<History> Histories { get; set; }
        public List<AnalysisHistory> AnalysisHistories { get; set; }
    }
}
