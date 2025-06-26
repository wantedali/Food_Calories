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
                Size    = new SixLabors.ImageSharp.Size(300, 0),
                Mode    = ResizeMode.Max
            }));

            // --- 2) Encode as JPEG @50% quality ---
            await using var ms = new MemoryStream();
            var encoder = new JpegEncoder { Quality = 50 };
            await img.SaveAsJpegAsync(ms, encoder);

            // --- 3) Convert to Base64 data URL ---
            var jpegBytes = ms.ToArray();
            var base64    = Convert.ToBase64String(jpegBytes);
            var dataUrl   = $"data:image/jpeg;base64,{base64}";

            // --- 4) Build OpenAI payload with inline image ---
            var payload = new
            {
                model = "gpt-4o",   // full vision-enabled model
                messages = new[]
                {
                    new {
                        role    = "system",
                        content = "You are a nutrition expert. I will send you a food image inline; identify the dish, estimate the portion size, and provide nutrition facts (calories, protein, carbs, fat)."
                    },
                    new {
                        role    = "user",
                        content = dataUrl
                    }
                },
                max_tokens  = 300,
                temperature = 0.2m
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
