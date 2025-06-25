using FoodCalorie.Models;
using FoodCalorie.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FoodCalorie.Services
{
    public interface IHistoryService
    {
        Task SaveHistoryAsync(History history);
        Task SaveAnalysisHistoryAsync(IFormFile imageFile, AnalysisHistory history);

        Task<UserHistoryResponseWithImage?> GetUserHistoriesAsync(string userId);
        Task<FileStreamResult?> GetImageAsync(string id);
    }
}
