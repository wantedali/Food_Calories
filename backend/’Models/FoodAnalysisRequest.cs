using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FoodCalorie.Models
{
    public class FoodAnalysisRequest
    {
        [Required]
        public IFormFile ImageFile { get; set; } = null!;
    }
}
