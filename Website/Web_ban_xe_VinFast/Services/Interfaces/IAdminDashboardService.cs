using Web_ban_xe_VinFast.DTOs.Admin;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<DashboardDto> GetDashboardDataAsync(string filter);
        Task<byte[]> ExportOrdersToExcelAsync();
    }
}
