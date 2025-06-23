using System.ComponentModel.DataAnnotations;
using FoodCalorie.Models;

namespace FoodCalorie.DTOs
{
    public class RegisterRequest
    {
       public CradentialVaildation UserData { get; set; }

        [Required]
        public Gender Gender { get; set; }

        [Range(1.2, 2.5, ErrorMessage = "Activity level must be between 1.2 and 2.5")]
        public double ActivityLevel { get; set; }

        [Range(10, 100)]
        public int Age { get; set; }

        [Range(30, 250)]
        public double Weight { get; set; }

        [Range(80, 250)]
        public double Height { get; set; }

        [Required]
        public Goal Goal { get; set; }

        [Required]
        public HowFast HowFast { get; set; }

        [Range(0, 60)]
        public double? BodyFat { get; set; }
    }
}
