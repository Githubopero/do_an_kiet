using Web_ban_xe_VinFast.DTOs.CarImage;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICarImageService
    {
        Task<List<CarImageDto>> GetAllImagesAsync();
        Task<List<CarImageDto>> GetImagesByCarIdAsync(long carId);
        Task<CarImageDto> AddImageAsync(UploadCarImageRequest req);
        Task UpdateImageAsync(long id, UploadCarImageRequest req);
        Task DeleteImageAsync(long id);
    }
}
