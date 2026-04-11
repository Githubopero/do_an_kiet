using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.DTOs.Admin;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICarService
    {
        Task<List<CarListDto>> GetAllCarsAsync();
        Task<List<CarListDto>> FilterCarsAsync(CarFilterParams param);
        Task<CarDetailDto> GetCarDetailAsync(long carId);
        Task<PriceDetailDto> CalculatePriceAsync(ConfigPriceRequest req);

        Task<List<CarListDto>> GetAllCarsAdminAsync();
        Task CreateCarAsync(CreateCarRequest req);
    }
}
