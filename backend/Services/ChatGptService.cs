using System.Text.Json;
using System.Text;

namespace FoodCalorie.Services
{
    public class ChatGptService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ChatGptService(IConfiguration config)
        {
            _httpClient = new HttpClient();
            _apiKey = config["OPENAI_API_KEY"]; 
        }

        public async Task<object> AnalyzeMealAsync(string meal)
        {
            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                new { role = "system", content = "You are a nutritionist assistant. Given a meal description, return an object with calories, protein, carbs, and fat in grams. Respond only with JSON." },
                new { role = "user", content = $"Analyze this meal: {meal}" }
            },
                temperature = 0.5
            };

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.openai.com/v1/chat/completions"),
                Headers =
            {
                { "Authorization", $"Bearer {_apiKey}" }
            },
                Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            };

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            var result = JsonDocument.Parse(json);
            var content = result.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .ToString();

            // Parse the returned content as JSON
            return JsonSerializer.Deserialize<object>(content);
        }
    }

}
