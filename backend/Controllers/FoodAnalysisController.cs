using FoodCalorie.Models;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.Net.Http.Json;

namespace FoodCalorie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodAnalysisController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public FoodAnalysisController(IHttpClientFactory httpClientFactory)
            => _httpClientFactory = httpClientFactory;

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze([FromForm] FoodAnalysisRequest request)
        {
            if (request.ImageFile == null || request.ImageFile.Length == 0)
                return BadRequest("Please upload a food image.");

            // --- 1) Load & resize the image ---
            using var img   = await Image.LoadAsync(request.ImageFile.OpenReadStream());
            img.Mutate(x => x.Resize(new ResizeOptions {
                Size    = new SixLabors.ImageSharp.Size(1024, 0),
                Mode    = ResizeMode.Max
            }));

            // --- 2) Encode as JPEG with higher quality for better recognition ---
            await using var ms = new MemoryStream();
            var encoder = new JpegEncoder { Quality = 85 };
            await img.SaveAsJpegAsync(ms, encoder);

            // --- 3) Convert to Base64 data URL ---
            var jpegBytes = ms.ToArray();
            var base64    = Convert.ToBase64String(jpegBytes);
            var dataUrl   = $"data:image/jpeg;base64,{base64}";

            // --- 4) Build OpenAI payload with inline image ---
            var payload = new
            {
                model = "o4-mini",   // GPT-4 with vision capabilities
                messages = new object[]
                {
                    new {
                        role    = "system",
                        content = "You are a food vision specialist. Analyze the food image and provide:\n1. Name: (count + food type, e.g., '9 Donuts')\n2. Nutrition Facts per item: (calories, protein g, carbs g, fat g for ONE item)\n3. Portion Size: (what one item represents)\n4. Total Nutrition: (total calories, protein g, carbs g, fat g for ALL items detected)\n\nCount all similar food items together. Keep response simple and direct."
                    },
                    new {
                        role    = "user",
                        content = new object[] {
                            new {
                                type = "text",
                                text = "Count and identify the food in this image. Provide: count + food type, nutrition per item, portion size, and total nutrition for all items."
                            },
                            new {
                                type = "image_url",
                                image_url = new {
                                    url = dataUrl,
                                    detail = "high"
                                }
                            }
                        }
                    }
                },
              
                temperature = 1m
            };

            // --- 5) Call the API ---
            var client = _httpClientFactory.CreateClient("OpenAI");
            var resp   = await client.PostAsJsonAsync("chat/completions", payload);

            if (!resp.IsSuccessStatusCode)
                return StatusCode((int)resp.StatusCode, await resp.Content.ReadAsStringAsync());

            var openAiResp = await resp.Content.ReadFromJsonAsync<OpenAiResponse>();
            var analysis   = openAiResp!.Choices.First().Message.Content;

            return Ok(new { analysis });
        }

        // DTOs for deserializing OpenAI response
        private class OpenAiResponse { public List<Choice> Choices { get; set; } = null!; }
        private class Choice        { public Message Message      { get; set; } = null!; }
        private class Message       { public string Content      { get; set; } = null!; }
    }
}
