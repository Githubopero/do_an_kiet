using Web_ban_xe_VinFast.DTOs.Customer;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IAppointmentService
    {
        //quản lý lịch hẹn (dealer staff)
        Task<List<AppointmentDto>> GetDealerAppointmentsAsync(long dealerId);
        Task UpdateAppointmentAsync(long id, UpdateAppointmentRequest req, long dealerId);
        Task DeleteAppointmentAsync(long id, long dealerId);

        // lịch hẹn customer
        Task CreateAppointmentAsync(long userId, AppointmentCreateDto dto);
        Task<List<Appointment>> GetUserAppointmentsAsync(long userId);
    }
}
