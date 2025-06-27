using FoodCalorie.Models;
using FoodCalorie.Services;
using FoodCalorie.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FoodCalorie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        // ✅ 1. Save Basic History (no image)
        [HttpPost("basic")]
        public async Task<IActionResult> AddHistory([FromBody] HistoryDto history)
        {
            if (string.IsNullOrEmpty(history.UserId))
                return BadRequest("UserId is required");

            await _historyService.SaveHistoryAsync(history);
            return Ok("History saved successfully");
        }

        // ✅ 2. Save Analysis History (with image)
        [HttpPost("analysis")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddAnalysisHistory([FromForm] AnalysisHistoryForm model)
        {
            if (model.Image == null || model.Image.Length == 0)
                return BadRequest("Image is required");

            var history = new AnalysisHistory
            {
                UserId = model.UserId,
                MealName = model.MealName,
                Calories = model.Calories,
                Protein = model.Protein,
                Carbs = model.Carbs,
                Fat = model.Fat,
                Wieght = model.Wieght
            };

            await _historyService.SaveAnalysisHistoryAsync(model.Image, history);
            return Ok("Saved successfully");
        }

        [HttpDelete("remove-history")]
        public async Task<IActionResult> RemoveHistory([FromQuery] string userId,[FromQuery] string historyId,[FromQuery] string type)
        {
            var success = await _historyService.RemoveHistoryAsync(userId, historyId, type.ToLower());
            if (!success)
                return NotFound("History not found or invalid type");

            return Ok("History item removed successfully");
        }



        // ✅ 3. Get Both Lists with Images
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserHistory(string userId)
        {
            var response = await _historyService.GetUserHistoriesAsync(userId);
            if (response == null) return NotFound("User not found");

            return Ok(response);
        }
    }
}
