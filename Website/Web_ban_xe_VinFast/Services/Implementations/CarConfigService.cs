using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CarConfigService:ICarConfigService
    {
        private readonly VinFastDbContext _context;

        public CarConfigService(VinFastDbContext context)
        {
            _context = context;
        }

        public async Task<List<CarConfigDto>> GetAllConfigsAsync()
        {
            return await _context.CarConfigurations
                .Include(c => c.Xe)
                .Include(c => c.PhienBan)
                .Select(c => new CarConfigDto
                {
                    Id = c.Id,
                    XeId = c.XeId, // THÊM DÒNG NÀY
                    PhienBanId = c.PhienBanId, // THÊM DÒNG NÀY
                    MauXe = c.Xe.MauXe,
                    TenPhienBan = c.PhienBan != null ? c.PhienBan.TenPhienBan : "",
                    MauNgoaiThat = c.MauNgoaiThat,
                    MauNoiThat = c.MauNoiThat,
                    LoaiPin = c.LoaiPin,
                    LoaiNoiThat = c.LoaiNoiThat,
                    TongGia = c.TongGia
                })
                .ToListAsync();
        }

        public async Task CreateConfigAsync(CreateCarConfigRequest req)
        {
            var config = new CarConfiguration
            {
                XeId = req.XeId,
                PhienBanId = req.PhienBanId,
                MauNgoaiThat = req.MauNgoaiThat,
                MauNoiThat = req.MauNoiThat,
                LoaiPin = req.LoaiPin,
                LoaiNoiThat = req.LoaiNoiThat,
                TongGia = req.TongGia
            };

            _context.CarConfigurations.Add(config);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConfigAsync(long id, UpdateCarConfigRequest req)
        {
            var config = await _context.CarConfigurations.FindAsync(id);
            if (config == null) throw new Exception("Cấu hình không tồn tại");

            // Bổ sung cập nhật PhienBanId để giống như khi Thêm
            config.PhienBanId = req.PhienBanId;

            config.MauNgoaiThat = req.MauNgoaiThat;
            config.MauNoiThat = req.MauNoiThat;
            config.LoaiPin = req.LoaiPin;
            config.LoaiNoiThat = req.LoaiNoiThat;
            config.TongGia = req.TongGia;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteConfigAsync(long id)
        {
            var config = await _context.CarConfigurations.FindAsync(id);
            if (config == null) throw new Exception("Cấu hình không tồn tại");

            _context.CarConfigurations.Remove(config);
            await _context.SaveChangesAsync();
        }
    }
}
