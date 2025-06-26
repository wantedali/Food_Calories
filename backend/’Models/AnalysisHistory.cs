using MongoDB.Bson.Serialization.Attributes;

namespace FoodCalorie.Models
{
    public class AnalysisHistory : History
    {
        public byte[] ImageData { get; set; }

        public string ImageContentType { get; set; }  // e.g., "image/jpeg"
    }
}
