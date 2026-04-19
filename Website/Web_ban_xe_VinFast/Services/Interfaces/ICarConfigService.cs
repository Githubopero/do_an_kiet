using Web_ban_xe_VinFast.DTOs.Admin;
namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface ICarConfigService
    {
        Task<List<CarConfigDto>> GetAllConfigsAsync();
        Task CreateConfigAsync(CreateCarConfigRequest req);
        Task UpdateConfigAsync(long id, UpdateCarConfigRequest req);
        Task DeleteConfigAsync(long id);
    }
}
