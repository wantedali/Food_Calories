using System.ComponentModel.DataAnnotations;
using FoodCalorie.Models;

namespace FoodCalorie.DTOs
{
    public class RegisterRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?]).+$",
            ErrorMessage = "Password must contain at least one uppercase letter, one number, and one special character")]
        public string Password { get; set; } = string.Empty;

        [Required]
        public Gender Gender { get; set; }

        [Range(1.2, 2.5, ErrorMessage = "Activity level must be between 1.2 and 2.5")]
        public double ActivityLevel { get; set; }

        [Range(10, 100)]
        public int Age { get; set; }

        [Range(30, 250)]
        public int Weight { get; set; }

        [Range(80, 250)]
        public int Height { get; set; }

        [Required]
        public Goal Goal { get; set; }

        [Required]
        public HowFast HowFast { get; set; }

        [Range(0, 60)]
        public double? BodyFat { get; set; }
    }
}
