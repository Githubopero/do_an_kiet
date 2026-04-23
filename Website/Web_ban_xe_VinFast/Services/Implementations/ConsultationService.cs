using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Consultation;
using Web_ban_xe_VinFast.DTOs.Dealer;
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
        //yêu cầu tư vấn từ khách hàng
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


        //quản lý yêu cầu cho phía nhân viên đại lý
        public async Task<List<ConsultationDto>> GetAllConsultationsAsync()
        {
            return await _context.Consultations
                .OrderByDescending(c => c.Id) // Mới nhất lên trước
                .Select(c => new ConsultationDto
                {
                    Id = c.Id,
                    HoTen = c.HoTen,
                    SoDienThoai = c.SoDienThoai,
                    Email = c.Email,
                    MauXeQuanTam = c.MauXeQuanTam,
                    NoiDung = c.NoiDung,
                    MucDoUuTien = c.MucDoUuTien,
                    TrangThaiXyLy = c.TrangThaiXyLy,
                    MaTracking = c.MaTracking,
                    AnhDinhKem = c.AnhDinhKem,
                    //ThoiGianTao = c.ThoiGianTao
                }).ToListAsync();
        }

        public async Task UpdateConsultationAsync(long id, UpdateConsultationRequest request)
        {
            var con = await _context.Consultations.FindAsync(id);
            if (con == null) throw new Exception("Không tìm thấy yêu cầu tư vấn");

            if (!string.IsNullOrEmpty(request.MucDoUuTien))
                con.MucDoUuTien = request.MucDoUuTien;

            if (!string.IsNullOrEmpty(request.TrangThaiXyLy))
                con.TrangThaiXyLy = request.TrangThaiXyLy;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteConsultationAsync(long id)
        {
            var con = await _context.Consultations.FindAsync(id);
            if (con != null)
            {
                _context.Consultations.Remove(con);
                await _context.SaveChangesAsync();
            }
        }
    }
}
