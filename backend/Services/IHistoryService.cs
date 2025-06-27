using FoodCalorie.Models;
using FoodCalorie.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FoodCalorie.Services
{
    public interface IHistoryService
    {
        Task SaveHistoryAsync(HistoryDto history);
        Task SaveAnalysisHistoryAsync(IFormFile imageFile, AnalysisHistory history);

        Task<UserHistoryResponseWithImage?> GetUserHistoriesAsync(string userId);
        Task<FileStreamResult?> GetImageAsync(string id);

        Task<bool> RemoveHistoryAsync(string userId, string historyId, string type);
    }
}
