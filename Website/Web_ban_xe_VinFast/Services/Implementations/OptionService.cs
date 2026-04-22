using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class OptionService:IOptionService
    {
        private readonly VinFastDbContext _context; // Thay bằng tên DbContext của bạn

        public OptionService(VinFastDbContext context)
        {
            _context = context;
        }
        

        public async Task<List<OptionDto>> GetAllOptionsAsync()
        {
            return await _context.Options
                .Include(o => o.Xe)
                .Select(o => new OptionDto
                {
                    Id = o.Id,
                    XeId = o.XeId,
                    TenXe = o.Xe.MauXe,
                    LoaiTuyChon = o.LoaiTuyChon,
                    TenTuyChon = o.TenTuyChon,
                    AnhHuongDenGia = o.AnhHuongDenGia,
                    TrangThaiKhaDung = o.TrangThaiKhaDung
                })
                .ToListAsync();
        }

        public async Task<List<OptionDto>> GetOptionsByCarIdAsync(long carId)
        {
            return await _context.Options
                .Where(o => o.XeId == carId)
                .Select(o => new OptionDto
                {
                    Id = o.Id,
                    XeId = o.XeId,
                    LoaiTuyChon = o.LoaiTuyChon,
                    TenTuyChon = o.TenTuyChon,
                    AnhHuongDenGia = o.AnhHuongDenGia,
                    TrangThaiKhaDung = o.TrangThaiKhaDung
                }).ToListAsync();
        }

        public async Task CreateOptionAsync(CreateOptionRequest req)
        {
            var option = new Option
            {
                XeId = req.XeId,
                LoaiTuyChon = req.LoaiTuyChon,
                TenTuyChon = req.TenTuyChon,
                AnhHuongDenGia = req.AnhHuongDenGia,
                TrangThaiKhaDung = true
            };
            _context.Options.Add(option);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateOptionAsync(long id, CreateOptionRequest req)
        {
            var option = await _context.Options.FindAsync(id);
            if (option == null) throw new Exception("Không tìm thấy tùy chọn");

            option.XeId = req.XeId;
            option.LoaiTuyChon = req.LoaiTuyChon;
            option.TenTuyChon = req.TenTuyChon;
            option.AnhHuongDenGia = req.AnhHuongDenGia;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteOptionAsync(long id)
        {
            var option = await _context.Options.FindAsync(id);
            if (option != null)
            {
                _context.Options.Remove(option);
                await _context.SaveChangesAsync();
            }
        }
    }
}
