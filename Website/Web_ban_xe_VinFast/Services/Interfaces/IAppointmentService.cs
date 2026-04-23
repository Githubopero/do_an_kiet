using Web_ban_xe_VinFast.DTOs.Dealer;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IAppointmentService
    {
        //quản lý lịch hẹn (dealer staff)
        Task<List<AppointmentDto>> GetDealerAppointmentsAsync(long dealerId);
        Task UpdateAppointmentAsync(long id, UpdateAppointmentRequest req, long dealerId);
        Task DeleteAppointmentAsync(long id, long dealerId);
    }
}
