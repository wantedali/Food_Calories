using FoodCalorie.Models;
using FoodCalorie.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace FoodCalorie.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IMongoCollection<User> _users;

        public HistoryService(IOptions<MongoDBSettings> dbSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _users = database.GetCollection<User>("Users");
        }

        public async Task SaveHistoryAsync(History history)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, history.UserId);
            var update = Builders<User>.Update.Push(u => u.Histories, history);

            await _users.UpdateOneAsync(filter, update);
        }

        public async Task SaveAnalysisHistoryAsync(IFormFile imageFile, AnalysisHistory history)
        {
            using var memoryStream = new MemoryStream();
            await imageFile.CopyToAsync(memoryStream);

            history.ImageData = memoryStream.ToArray();
            history.ImageContentType = imageFile.ContentType;

            var filter = Builders<User>.Filter.Eq(u => u.Id, history.UserId);
            var update = Builders<User>.Update.Push(u => u.AnalysisHistories, history);

            await _users.UpdateOneAsync(filter, update);
        }

      public async Task<UserHistoryResponseWithImage?> GetUserHistoriesAsync(string userId)
    {
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null) return null;

        var analysisHistories = user.AnalysisHistories?.Select(h => new AnalysisHistoryWithImage
        {
            Id = h.Id.ToString(),
            MealName = h.MealName,
            Calories = h.Calories,
            Protein = h.Protein,
            Carbs = h.Carbs,
            Fat = h.Fat,
            Wieght = h.Wieght,
            date = h.date,
            ImageContentType = h.ImageContentType,
            ImageBase64 = h.ImageData != null ? Convert.ToBase64String(h.ImageData) : null
        }).ToList();

        return new UserHistoryResponseWithImage
        {
            Histories = user.Histories ?? new List<History>(),
            AnalysisHistories = analysisHistories ?? new List<AnalysisHistoryWithImage>()
        };
    }

        public async Task<FileStreamResult?> GetImageAsync(string id)
        {
            // Traverse all users to find the image by AnalysisHistory.Id
            var user = await _users
                .Find(u => u.AnalysisHistories.Any(h => h.Id == id))
                .FirstOrDefaultAsync();

            if (user == null) return null;

            var history = user.AnalysisHistories.FirstOrDefault(h => h.Id == id);
            if (history == null || history.ImageData == null)
                return null;

            var stream = new MemoryStream(history.ImageData);
            return new FileStreamResult(stream, history.ImageContentType)
            {
                FileDownloadName = $"{history.MealName}.jpg"
            };
        }
    }
}
