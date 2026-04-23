using Web_ban_xe_VinFast.DTOs.Consultation;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IConsultationService
    {
        //khách hàng
        Task<ConsultationResponse> CreateConsultationAsync(ConsultationRequest request, int? userId);
        Task<List<Consultation>> GetUserConsultationsAsync(int userId);

        //nhân viên đại lý
        Task<List<ConsultationDto>> GetAllConsultationsAsync();
        Task UpdateConsultationAsync(long id, UpdateConsultationRequest request);
        Task DeleteConsultationAsync(long id);
    }
}
