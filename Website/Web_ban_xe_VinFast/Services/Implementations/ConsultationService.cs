using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Consultation;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class ConsultationService:IConsultationService
    {
        private readonly VinFastDbContext _context;

        public ConsultationService(VinFastDbContext context)
        {
            _context = context;
        }

        public async Task<ConsultationResponse> CreateConsultationAsync(ConsultationRequest request, int? userId)
        {
            // Tạo mã tracking
            string maTracking = "TV" + DateTime.Now.ToString("yyyyMMdd") + Guid.NewGuid().ToString().Substring(0, 4).ToUpper();

            var consultation = new Consultation
            {
                HoTen = request.HoTen??"",
                SoDienThoai = request.SoDienThoai??"",
                Email = request.Email ?? "",
                MauXeQuanTam = request.MauXeQuanTam ?? "",
                NoiDung = request.NoiDung ?? "",
                MucDoUuTien = request.MucDoUuTien ?? "NORMAL",
                MaTracking = maTracking,

                // Gán đúng tên thuộc tính trong Model của bạn
                TrangThaiXyLy = "New",

                // Vì Model để null! nên phải gán chuỗi rỗng nếu không có ảnh
                AnhDinhKem = request.AnhDinhKem ?? "",

                ThoiGianTao = DateTime.Now,
                // NguoiDungId có thể gán sau nếu bạn muốn liên kết với tài khoản

                // Gán trực tiếp userId nhận được từ Controller
                NguoiDungId = userId
            };

            _context.Consultations.Add(consultation);
            await _context.SaveChangesAsync();

            return new ConsultationResponse
            {
                Success = true,
                Message = "Gửi tư vấn thành công",
                MaTracking = maTracking
            };
        }

        public async Task<List<Consultation>> GetUserConsultationsAsync(int userId)
        {
            return await _context.Consultations
                .Where(c => c.NguoiDungId == userId)
                .OrderByDescending(c => c.ThoiGianTao)
                .ToListAsync();
        }
    }
}
