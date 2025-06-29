using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using FoodCalorie.Models;
using FoodCalorie.Services;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace FoodCalorie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodAnalysisController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ChatGptService _chatGptService;

        public FoodAnalysisController(IHttpClientFactory httpClientFactory, ChatGptService chatGptService)
        {
            _httpClientFactory = httpClientFactory;
            _chatGptService    = chatGptService;
        }

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze([FromForm] FoodAnalysisRequest request)
        {
            if (request.ImageFile == null || request.ImageFile.Length == 0)
                return BadRequest("Please upload a food image.");

            // 1) Load & resize
            using var img = await Image.LoadAsync(request.ImageFile.OpenReadStream());
            img.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new SixLabors.ImageSharp.Size(1024, 0),
                Mode = ResizeMode.Max
            }));

            // 2) Encode to JPEG
            await using var ms = new MemoryStream();
            var encoder = new JpegEncoder { Quality = 85 };
            await img.SaveAsJpegAsync(ms, encoder);

            // 3) Convert to Base64
            var jpegBytes = ms.ToArray();
            var base64    = Convert.ToBase64String(jpegBytes);
            var dataUrl   = $"data:image/jpeg;base64,{base64}";

            // 4) Build AI payload for JSON-only output with descriptive portion size
            var payload = new
            {
                model = "o4-mini",
                messages = new object[]
                {
                    new {
                        role = "system",
                        content = @"You are a food vision specialist specializing in Egyptian cuisine. 
Analyze the food image and return a JSON array of objects, each with:
  - count: عدد العناصر
  - name: اسم العنصر
  - portionSize: حجم الحصة الواحدة (وصف بالجرامات)
  - nutritionPerItem: { calories, protein, carbs, fat } لكل عنصر
  - totalNutrition:   { calories, protein, carbs, fat } لجميع العناصر
Focus especially on Egyptian dishes, but include other foods if present. 
Please respond only with valid JSON. لا تضف أي تفسير آخر."
                    },
                    new {
                        role = "user",
                        content = new object[] {
                            new { type = "text", text = "Count and identify the food in this image." },
                            new { type = "image_url", image_url = new { url = dataUrl, detail = "high" } }
                        }
                    }
                },
                temperature = 1m
            };

            // 5) Call OpenAI
            var client = _httpClientFactory.CreateClient("OpenAI");
            var resp   = await client.PostAsJsonAsync("chat/completions", payload);
            if (!resp.IsSuccessStatusCode)
                return StatusCode((int)resp.StatusCode, await resp.Content.ReadAsStringAsync());

            var openAiResp = await resp.Content.ReadFromJsonAsync<OpenAiResponse>();
            var json       = openAiResp!.Choices.First().Message.Content.Trim();

            // 6) Deserialize JSON to DTOs
            List<FoodItem>? foods;
            try
            {
                foods = JsonSerializer.Deserialize<List<FoodItem>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (JsonException je)
            {
                return BadRequest(new { error = "Invalid JSON from AI", details = je.Message, raw = json });
            }

            // 7) Aggregate total nutrients across all items
            var aggregated = new Nutrition
            {
                Calories = foods.Sum(f => f.TotalNutrition.Calories),
                Protein  = foods.Sum(f => f.TotalNutrition.Protein),
                Carbs    = foods.Sum(f => f.TotalNutrition.Carbs),
                Fat      = foods.Sum(f => f.TotalNutrition.Fat)
            };

            // 8) Return both the items and a summary array
            return Ok(new
            {
                items   = foods,
                summary = new[] { aggregated }
            });
        }

        [HttpPost("analyze-meal-text")]
        public async Task<IActionResult> AnalyzeMealText([FromBody] string mealDescription)
        {
            try
            {
                var nutritionInfo = await _chatGptService.AnalyzeMealAsync(mealDescription);
                return Ok(nutritionInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Internal DTOs for AI response
        private class OpenAiResponse { public List<Choice> Choices { get; set; } = null!; }
        private class Choice        { public Message Message      { get; set; } = null!; }
        private class Message       { public string Content      { get; set; } = null!; }

        // Strongly-typed output models
        public class FoodItem
        {
            [JsonPropertyName("count")]        public int    Count            { get; set; }
            [JsonPropertyName("name")]         public string Name             { get; set; } = default!;
            [JsonPropertyName("portionSize")]  public string PortionSize      { get; set; } = default!;
            [JsonPropertyName("nutritionPerItem")] public Nutrition NutritionPerItem { get; set; } = default!;
            [JsonPropertyName("totalNutrition")]     public Nutrition TotalNutrition     { get; set; } = default!;
        }

        public class Nutrition
        {
            [JsonPropertyName("calories")] public float Calories { get; set; }
            [JsonPropertyName("protein")]  public float Protein  { get; set; }
            [JsonPropertyName("carbs")]    public float Carbs    { get; set; }
            [JsonPropertyName("fat")]      public float Fat      { get; set; }
        }
    }
}
