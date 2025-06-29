// Controllers/FoodAnalysisController.cs
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace FoodCalorie.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodDetection : ControllerBase
    {
        private readonly IHttpClientFactory _httpFactory;
        public FoodDetection(IHttpClientFactory httpFactory)
            => _httpFactory = httpFactory;

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze(
            [FromForm(Name = "ImageFile")] IFormFile ImageFile
        )
        {
            if (ImageFile == null || ImageFile.Length == 0)
                return BadRequest("No file uploaded.");

            // read bytes
            byte[] bytes;
            await using var ms = new MemoryStream();
            await ImageFile.CopyToAsync(ms);
            bytes = ms.ToArray();

            // proxy to Python
            var client = _httpFactory.CreateClient("FoodModel");
            using var content = new MultipartFormDataContent();
            var imgContent = new ByteArrayContent(bytes);
            imgContent.Headers.ContentType = new MediaTypeHeaderValue(ImageFile.ContentType);
            content.Add(imgContent, "file", ImageFile.FileName);

            var resp = await client.PostAsync("analyze", content);
            var pythonJson = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode)
                return StatusCode((int)resp.StatusCode, pythonJson);

            return Content(pythonJson, "application/json");
        }
    }
}
