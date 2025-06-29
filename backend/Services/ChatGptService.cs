using System.Text;
using System.Text.Json;

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

        public async Task<MealEstimateResponse> AnalyzeMealAsync(string meal)
        {
            var prompt = new[]
            {
                new
                {
                    role = "system",
                    content = @"You are a nutritionist assistant.
You will receive meal descriptions in English or Arabic.
Your job is to analyze the meal and return a valid JSON object with the following fields:
- name (same language as input)
- estimatedSize (a number representing the weight in grams, never a string)
- calories
- protein
- carbs
- fat
- canEstimate (true if confident estimation, false if unsure)

Make sure estimatedSize is always a number (like 200), not a string like '200g' or 'medium plate'.
If you're not sure, still give your best guess in grams."
                },
                new { role = "user", content = $"Analyze this meal: {meal}" }
            };

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = prompt,
                temperature = 0.4
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

            var jsonRoot = JsonDocument.Parse(content).RootElement;

            return new MealEstimateResponse
            {
                Name = jsonRoot.GetProperty("name").GetString(),
                EstimatedSize = jsonRoot.GetProperty("estimatedSize").ValueKind switch
                {
                    JsonValueKind.Number => jsonRoot.GetProperty("estimatedSize").GetDouble(),
                    JsonValueKind.String when double.TryParse(jsonRoot.GetProperty("estimatedSize").GetString(), out var num) => num,
                    _ => 0
                },
                Calories = jsonRoot.GetProperty("calories").GetDouble(),
                Protein = jsonRoot.GetProperty("protein").GetDouble(),
                Carbs = jsonRoot.GetProperty("carbs").GetDouble(),
                Fat = jsonRoot.GetProperty("fat").GetDouble(),
                CanEstimate = jsonRoot.GetProperty("canEstimate").GetBoolean()
            };
        }
    }

    public class MealEstimateResponse
    {
        public string? Name { get; set; }
        public double EstimatedSize { get; set; } // always in grams
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
        public bool CanEstimate { get; set; } = false;
    }
}
