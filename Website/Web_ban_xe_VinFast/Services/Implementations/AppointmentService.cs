using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Customer;
using Web_ban_xe_VinFast.DTOs.Dealer;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class AppointmentService:IAppointmentService
    {
        private readonly VinFastDbContext _context;

        public AppointmentService(VinFastDbContext context)
        {
            _context = context;
        }
        //quản lý lịch hẹn (dealer staff)
        public async Task<List<AppointmentDto>> GetDealerAppointmentsAsync(long dealerId)
        {
            return await _context.Appointments
                .Include(a => a.NguoiDung)
                .Where(a => a.DaiLyId == dealerId)
                .OrderByDescending(a => a.NgayGioHen)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    NguoiDungId = a.NguoiDungId,
                    HoTenKhachHang = a.NguoiDung.HoTen, // Giả định bảng User có cột HoTen
                    SoDienThoai = a.NguoiDung.SoDienThoai,
                    NgayGioHen = a.NgayGioHen,
                    GhiChu = a.GhiChu,
                    TrangThai = a.TrangThai
                }).ToListAsync();
        }

        public async Task UpdateAppointmentAsync(long id, UpdateAppointmentRequest req, long dealerId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DaiLyId == dealerId);

            if (appointment == null) throw new Exception("Lịch hẹn không tồn tại");

            appointment.NgayGioHen = req.NgayGioHen;
            appointment.GhiChu = req.GhiChu;
            appointment.TrangThai = req.TrangThai;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(long id, long dealerId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DaiLyId == dealerId);

            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }



        //lịch hẹn customer
        public async Task CreateAppointmentAsync(long userId, AppointmentCreateDto dto)
        {
            // Kiểm tra xem thời gian hẹn có trong tương lai không
            if (dto.NgayGioHen <= DateTime.Now)
                throw new Exception("Ngày hẹn phải lớn hơn thời gian hiện tại.");

            var appointment = new Appointment
            {
                NguoiDungId = userId,
                DaiLyId = dto.DaiLyId,
                NgayGioHen = dto.NgayGioHen,
                GhiChu = dto.GhiChu,
                TrangThai = "Scheduled", // Mặc định khi tạo mới
                ThoiGianTao = DateTime.Now
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Appointment>> GetUserAppointmentsAsync(long userId)
        {
            return await _context.Appointments
                .Where(a => a.NguoiDungId == userId)
                .OrderByDescending(a => a.NgayGioHen) // Lịch gần nhất lên đầu
                .ToListAsync();
        }
    }
}
