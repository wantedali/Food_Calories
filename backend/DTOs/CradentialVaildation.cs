using System.ComponentModel.DataAnnotations;

namespace FoodCalorie.DTOs
{
    public class CradentialVaildation
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
    }
}
