using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CarService : ICarService
    {
        private readonly VinFastDbContext _context;

        public CarService(VinFastDbContext context) => _context = context;

        public async Task<List<CarListDto>> GetAllCarsAsync()
        {
            return await _context.Cars
                .Where(c => c.TrangThaiHoatDong == "active")
                .Select(c => new CarListDto
                {
                    Id = c.Id,
                    MauXe = c.MauXe,
                    TrangThaiHoatDong = c.TrangThaiHoatDong, // THÊM DÒNG NÀY
                    // Sửa ở đây: Tránh lỗi Min khi không có phiên bản
                    GiaThapNhat = c.CarVersions.Any()
                        ? c.CarVersions.Min(v => v.GiaCoBan)
                        : 0,

                    DuongDanHinhAnhChinh = c.CarImages
                        .OrderBy(i => i.ThuTuSapXep)
                        .Select(i => i.DuongDanHinhAnh)
                        .FirstOrDefault() ?? ""
                })
                .ToListAsync();
        }

        public async Task<List<CarListDto>> FilterCarsAsync(CarFilterParams param)
        {
            var query = _context.Cars
                .Include(c => c.CarVersions)
                .Include(c => c.CarImages)
                .Where(c => c.TrangThaiHoatDong == "active");

            if (!string.IsNullOrEmpty(param.Keyword))
                query = query.Where(c => c.MauXe.Contains(param.Keyword));

            if (param.MinPrice.HasValue)
                query = query.Where(c => c.CarVersions.Any(v => v.GiaCoBan >= param.MinPrice));
            if (param.MaxPrice.HasValue)
                query = query.Where(c => c.CarVersions.Any(v => v.GiaCoBan <= param.MaxPrice));
            if (param.SoChoNgoi.HasValue)
                query = query.Where(c => c.CarVersions.Any(v => v.SoChoNgoi == param.SoChoNgoi));

            return await query.Select(c => new CarListDto
            {
                Id = c.Id,
                MauXe = c.MauXe,
                GiaThapNhat = c.CarVersions.Any()
                    ? c.CarVersions.Min(v => v.GiaCoBan)
                    : 0,
                DuongDanHinhAnhChinh = c.CarImages.OrderBy(i => i.ThuTuSapXep).Select(i => i.DuongDanHinhAnh).FirstOrDefault() ?? ""
            }).ToListAsync();
        }

        public async Task<CarDetailDto> GetCarDetailAsync(long carId)
        {
            var car = await _context.Cars
                .Include(c => c.CarVersions)
                .Include(c => c.CarImages)
                .Include(c => c.CarConfigurations)
                .FirstOrDefaultAsync(c => c.Id == carId);

            if (car == null || car.TrangThaiHoatDong != "active")
                throw new Exception("Xe không tồn tại hoặc đã ngừng bán");

            return new CarDetailDto
            {
                Id = car.Id,
                MauXe = car.MauXe,
                MoTa = car.MoTa,
                PhienBan = car.CarVersions.Select(v => new CarVersionDto
                {
                    Id = v.Id,
                    TenPhienBan = v.TenPhienBan,
                    GiaCoBan = v.GiaCoBan,
                    DungLuongPin = v.DungLuongPin,
                    QuangDuongDiChuyen = v.QuangDuongDiChuyen
                }).ToList(),
                HinhAnh = car.CarImages.Select(i => new CarImageDto
                {
                    DuongDanHinhAnh = i.DuongDanHinhAnh,
                    LoaiAnh = i.LoaiAnh
                }).ToList(),
                CauHinhCoSan = car.CarConfigurations.Select(cfg => new CarConfigurationDto
                {
                    MauNgoaiThat = cfg.MauNgoaiThat,
                    MauNoiThat = cfg.MauNoiThat,
                    LoaiPin = cfg.LoaiPin,
                    LoaiNoiThat = cfg.LoaiNoiThat,
                    TongGia = cfg.TongGia
                }).ToList()
            };
        }

        public async Task<PriceDetailDto> CalculatePriceAsync(ConfigPriceRequest req)
        {
            // Log để debug (tạm thời)
            Console.WriteLine($"[CalculatePrice] XeId={req.XeId}, PhienBanId={req.PhienBanId}, " +
                              $"NgoaiThat={req.MauNgoaiThat}, NoiThat={req.MauNoiThat}, " +
                              $"Pin={req.LoaiPin}, NoiThatType={req.LoaiNoiThat}");

            var config = await _context.CarConfigurations
                .FirstOrDefaultAsync(c =>
                    c.XeId == req.XeId &&
                    c.PhienBanId == req.PhienBanId &&
                    c.MauNgoaiThat.Trim().ToLower() == req.MauNgoaiThat.Trim().ToLower() &&
                    c.MauNoiThat.Trim().ToLower() == req.MauNoiThat.Trim().ToLower() &&
                    c.LoaiPin.Trim().ToLower() == req.LoaiPin.Trim().ToLower() &&
                    c.LoaiNoiThat.Trim().ToLower() == req.LoaiNoiThat.Trim().ToLower());

            if (config == null)
            {
                // Trả về lỗi rõ ràng thay vì throw exception gây 500
                throw new Exception($"Không tìm thấy cấu hình phù hợp. " +
                    $"XeId={req.XeId}, PhienBan={req.PhienBanId}, " +
                    $"Ngoại={req.MauNgoaiThat}, Nội={req.MauNoiThat}, Pin={req.LoaiPin}");
            }

            return new PriceDetailDto
            {
                GiaCoBan = config.TongGia,
                PhiOption = 0,
                TongGia = config.TongGia
            };
        }

        // === ADMIN METHODS ===
        // 2. Sửa lại hàm GetAllCarsAdminAsync để Admin thấy được cả xe bị ẩn
        public async Task<List<CarListDto>> GetAllCarsAdminAsync()
        {
            return await _context.Cars
                .Select(c => new CarListDto
                {
                    Id = c.Id,
                    MauXe = c.MauXe,
                    TrangThaiHoatDong = c.TrangThaiHoatDong, // THÊM DÒNG NÀY
                    GiaThapNhat = c.CarVersions.Any() ? c.CarVersions.Min(v => v.GiaCoBan) : 0,
                    // Admin có thể không cần hình ảnh ở bảng danh sách này để tải cho nhanh
                })
                .ToListAsync();
        }

        public async Task CreateCarAsync(CreateCarRequest req)
        {
            var car = new Car
            {
                MauXe = req.MauXe,
                MoTa = req.MoTa,
                TrangThaiHoatDong = req.TrangThaiHoatDong
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
        }



        public async Task<IEnumerable<CarVersionDto>> GetVersionsByCarIdAsync(long carId)
        {
            return await _context.CarVersions
                .Where(v => v.XeId == carId)
                .Select(v => new CarVersionDto
                {
                    Id = v.Id,
                    TenPhienBan = v.TenPhienBan,
                    GiaCoBan = v.GiaCoBan,
                    DungLuongPin = v.DungLuongPin,
                    QuangDuongDiChuyen = v.QuangDuongDiChuyen
                })
                .ToListAsync();
        }

        public async Task CreateVersionAsync(long carId, CarVersionDto dto)
        {
            var phienBan = new CarVersion
            {
                XeId = carId,
                TenPhienBan = dto.TenPhienBan,
                GiaCoBan = dto.GiaCoBan,
                DungLuongPin = dto.DungLuongPin,
                QuangDuongDiChuyen = dto.QuangDuongDiChuyen
            };

            _context.CarVersions.Add(phienBan);
            await _context.SaveChangesAsync();
        }
    }
}