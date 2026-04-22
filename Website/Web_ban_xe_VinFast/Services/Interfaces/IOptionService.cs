using Web_ban_xe_VinFast.DTOs.Admin;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IOptionService
    {
        Task<List<OptionDto>> GetAllOptionsAsync();
        Task<List<OptionDto>> GetOptionsByCarIdAsync(long carId);
        Task CreateOptionAsync(CreateOptionRequest req);
        Task UpdateOptionAsync(long id, CreateOptionRequest req);
        Task DeleteOptionAsync(long id);
    }
}
