using Web_ban_xe_VinFast.DTOs.Consultation;
using Web_ban_xe_VinFast.Models;

namespace Web_ban_xe_VinFast.Services.Interfaces
{
    public interface IConsultationService
    {
        Task<ConsultationResponse> CreateConsultationAsync(ConsultationRequest request, int? userId);
        Task<List<Consultation>> GetUserConsultationsAsync(int userId);
    }
}
