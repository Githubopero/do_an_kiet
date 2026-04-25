using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.DTOs.Admin;
using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.DTOs.Customer;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CarService : ICarService
    {
        private readonly VinFastDbContext _context;
        // Giả sử server của bạn chạy port 5000, hãy thay đổi cho đúng với thực tế
        private readonly string _baseUploadUrl = "http://localhost:5130/uploads/";

        public CarService(VinFastDbContext context) => _context = context;
        // Hàm phụ trợ để xử lý URL ảnh
        private string GetFullImageUrl(string? path)
        {
            if (string.IsNullOrEmpty(path)) return "";
            if (path.StartsWith("http")) return path;

            // Bước 1: Lấy tên file gốc bằng cách loại bỏ các chữ "uploads/" hoặc "uploads\" nếu có
            // Ví dụ: "uploads/xe.jpg" sẽ chỉ còn "xe.jpg"
            string fileName = path.Replace("uploads/", "").Replace("uploads\\", "");

            // Bước 2: Nối lại theo chuẩn duy nhất một lần
            // Kết quả mong muốn: http://localhost:5130/uploads/xe.jpg
            return $"http://localhost:5130/uploads/{fileName}";
        }
        public async Task<List<CarListDto>> GetAllCarsAsync()
        {
            var cars = await _context.Cars
            .Where(c => c.TrangThaiHoatDong == "active" && !c.IsDeleted)
            .Select(c => new
            {
                c.Id,
                c.MauXe,
                c.TrangThaiHoatDong,
                c.MoTa,
                GiaThapNhat = c.CarVersions.Any() ? c.CarVersions.Min(v => v.GiaCoBan) : 0,
                AnhChinh = c.CarImages.OrderBy(i => i.ThuTuSapXep).Select(i => i.DuongDanHinhAnh).FirstOrDefault()
            })
            .ToListAsync();

            // Map sang DTO và xử lý URL ảnh
            return cars.Select(c => new CarListDto
            {
                Id = c.Id,
                MauXe = c.MauXe,
                TrangThaiHoatDong = c.TrangThaiHoatDong,
                MoTa = c.MoTa,
                GiaThapNhat = c.GiaThapNhat,
                DuongDanHinhAnhChinh = GetFullImageUrl(c.AnhChinh)
            }).ToList();
        
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
                GiaThapNhat = c.CarVersions.Any() ? c.CarVersions.Min(v => v.GiaCoBan) : 0,
                // Phải đi qua hàm xử lý URL giống như GetAllCarsAsync
                DuongDanHinhAnhChinh = GetFullImageUrl(c.CarImages.OrderBy(i => i.ThuTuSapXep).Select(i => i.DuongDanHinhAnh).FirstOrDefault())
            }).ToListAsync();
        }

        public async Task<CarDetailDto> GetCarDetailAsync(long carId)
        {
            var car = await _context.Cars
        .Include(c => c.CarVersions)
        .Include(x => x.Options)
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

                // ĐỒNG BỘ LOGIC LẤY ẢNH CHÍNH TẠI ĐÂY
                DuongDanHinhAnhChinh = GetFullImageUrl(
                    car.CarImages
                       .OrderBy(i => i.ThuTuSapXep)
                       .Select(i => i.DuongDanHinhAnh)
                       .FirstOrDefault()
                ),

                PhienBan = car.CarVersions.Select(v => new CarVersionDto
                {
                    Id = v.Id,
                    TenPhienBan = v.TenPhienBan,
                    GiaCoBan = v.GiaCoBan,
                    DungLuongPin = v.DungLuongPin,
                    QuangDuongDiChuyen = v.QuangDuongDiChuyen
                }).ToList(),

                Options = car.Options
                    .Where(opt => opt.TrangThaiKhaDung == true)
                    .Select(opt => new Web_ban_xe_VinFast.DTOs.Admin.OptionDto
                    {
                        Id = opt.Id,
                        XeId = opt.XeId,
                        LoaiTuyChon = opt.LoaiTuyChon,
                        TenTuyChon = opt.TenTuyChon,
                        AnhHuongDenGia = opt.AnhHuongDenGia,
                        TrangThaiKhaDung = opt.TrangThaiKhaDung
                    }).ToList(),

                // Danh sách toàn bộ ảnh (để nếu sau này bạn muốn làm slider)
                HinhAnh = car.CarImages.Select(i => new CarImageDto
                {
                    DuongDanHinhAnh = GetFullImageUrl(i.DuongDanHinhAnh),
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
            // Debug: Kiểm tra xem có tồn tại phiên bản này không, chưa cần check XeId vội
            var version = await _context.CarVersions.FindAsync(req.PhienBanId);

            if (version == null)
                throw new Exception($"Không tìm thấy phiên bản ID {req.PhienBanId} trong hệ thống");

            if (version.XeId != req.XeId)
                throw new Exception($"Phiên bản ID {req.PhienBanId} không thuộc về xe ID {req.XeId}");
            

            if (version == null) throw new Exception("Phiên bản xe không tồn tại");

            decimal basePrice = version.GiaCoBan;
            decimal optionsPrice = 0;

            // 2. Danh sách các loại tùy chọn (SỬA LẠI KEY Ở ĐÂY)
            // Key bên trái phải khớp với giá trị trong cột LoaiTuyChon của DB
            var selectedOptions = new List<(string Category, string Value)>
    {
        ("exterior_color", req.MauNgoaiThat),
        ("interior_color", req.MauNoiThat),
        ("battery_type", req.LoaiPin),
        ("interior_type", req.LoaiNoiThat)
    };

            // 3. Cộng dồn giá từ bảng Options
            foreach (var opt in selectedOptions)
            {
                if (!string.IsNullOrEmpty(opt.Value))
                {
                    var optionData = await _context.Options
                        .FirstOrDefaultAsync(o =>
                            o.XeId == req.XeId &&
                            o.LoaiTuyChon.ToLower() == opt.Category.ToLower() &&
                            o.TenTuyChon.ToLower() == opt.Value.ToLower() &&
                            o.TrangThaiKhaDung == true);

                    if (optionData != null)
                    {
                        // Cộng dồn giá của từng option vào tổng phí
                        optionsPrice += optionData.AnhHuongDenGia ?? 0;
                    }
                }
            }

            // 4. Trả về kết quả tổng hợp
            return new PriceDetailDto
            {
                GiaCoBan = basePrice,
                PhiOption = optionsPrice,
                TongGia = basePrice + optionsPrice // Tổng giá cuối cùng
            };
        }

        // === ADMIN METHODS ===
        // 2. Sửa lại hàm GetAllCarsAdminAsync để Admin thấy được cả xe bị ẩn
        public async Task<List<CarListDto>> GetAllCarsAdminAsync()
        {
            return await _context.Cars
                .Where(c => !c.IsDeleted) // Chỉ lấy những xe chưa bị xóa mềm
                .Select(c => new CarListDto
                {
                    Id = c.Id,
                    MauXe = c.MauXe,
                    MoTa = c.MoTa, // THÊM DÒNG NÀY ĐỂ TRẢ VỀ MÔ TẢ
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


        //quản lý phiên bản xe admin
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

        public async Task<List<CarVersionDto>> GetAllVersionsAdminAsync()
        {
            return await _context.CarVersions
                .Include(v => v.Xe) // Join với bảng Cars để lấy tên mẫu xe
                .Where(v => !v.IsDeleted) // Chỉ lấy bản ghi chưa xóa mềm
                .OrderByDescending(v => v.Id) // Sắp xếp ID giảm dần (mới nhất lên đầu)
                .Select(v => new CarVersionDto
                {
                    Id = v.Id,
                    XeId = v.XeId,
                    MauXe = v.Xe.MauXe, // Ánh xạ từ bảng Cars
                    TenPhienBan = v.TenPhienBan,
                    GiaCoBan = v.GiaCoBan,
                    DungLuongPin = v.DungLuongPin,
                    QuangDuongDiChuyen = v.QuangDuongDiChuyen,
                    // Ép kiểu từ sbyte? sang int để khớp với DTO
                    SoChoNgoi = v.SoChoNgoi.HasValue ? (int)v.SoChoNgoi.Value : 5
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
                QuangDuongDiChuyen = dto.QuangDuongDiChuyen,
                SoChoNgoi = (sbyte)dto.SoChoNgoi, // Ép kiểu về sbyte cho khớp model
                IsDeleted = false,
                ThoiGianTao = DateTime.Now // Tự động lưu thời gian tạo
            };

            _context.CarVersions.Add(phienBan);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateVersionAsync(long versionId, CarVersionDto dto)
        {
            var v = await _context.CarVersions.FindAsync(versionId);
            if (v == null) throw new Exception("Không tìm thấy phiên bản");
            v.TenPhienBan = dto.TenPhienBan;
            v.SoChoNgoi = (sbyte)dto.SoChoNgoi; // Cập nhật số chỗ ngồi
            v.DungLuongPin = dto.DungLuongPin;
            v.QuangDuongDiChuyen = dto.QuangDuongDiChuyen;
            v.GiaCoBan = dto.GiaCoBan;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVersionAsync(long versionId)
        {
            var v = await _context.CarVersions.FindAsync(versionId);
            if (v != null)
            {
                v.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
        }



        //quản lý xe admin
        // 1. Cập nhật thông tin cơ bản (Tên xe và Mô tả)
        public async Task UpdateCarAsync(long id, UpdateCarRequest request)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                throw new Exception("Không tìm thấy mẫu xe này trong hệ thống.");
            }
            if (string.IsNullOrWhiteSpace(request.MauXe))
                throw new Exception("Tên mẫu xe không được để trống.");

            // Cập nhật các trường thông tin
            car.MauXe = request.MauXe;
            car.MoTa = request.MoTa;

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
        }

        // 2. Cập nhật trạng thái hoạt động (Active/Inactive)
        public async Task UpdateCarStatusAsync(long id, string status)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                throw new Exception("Không tìm thấy xe để cập nhật trạng thái.");
            }

            // Chuyển status về lowercase để đồng bộ dữ liệu nếu cần
            car.TrangThaiHoatDong = status.ToLower();

            await _context.SaveChangesAsync();
        }

        // 3. Xóa xe
        public async Task DeleteCarAsync(long id)
        {
            var car = await _context.Cars
                .IgnoreQueryFilters() // Phải thêm cái này để tìm được cả xe đã xóa nếu cần
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null) throw new Exception("Xe không tồn tại");

            car.IsDeleted = true;
            car.TrangThaiHoatDong = "inactive"; // Kết hợp đổi trạng thái để đồng bộ UI

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();
        }


        //so sánh xe(customer)
        public async Task<List<CarCompareDto>> GetAllVersionsForComparisonAsync()
        {
            var versions = await _context.CarVersions
        .Include(v => v.Xe)
        .ThenInclude(x => x.CarImages)
        .Select(v => new
        {
            Id = v.Id, // Đổi thành Id = v.Id
            TenMauXe = v.Xe.MauXe,
            TenPhienBan = v.TenPhienBan, // Bỏ v. ở bên trái
            GiaCoBan = v.GiaCoBan, // Bỏ v. ở bên trái
            DungLuongPin = v.DungLuongPin,
            QuangDuongDiChuyen = v.QuangDuongDiChuyen,
            SoChoNgoi = v.SoChoNgoi,
            AnhRaw = v.Xe.CarImages
                        .Where(img => img.LoaiAnh == "main")
                        .Select(img => img.DuongDanHinhAnh)
                        .FirstOrDefault()
        }).ToListAsync();

            return versions.Select(v => new CarCompareDto
            {
                Id = v.Id,
                TenMauXe = v.TenMauXe,
                TenPhienBan = v.TenPhienBan,
                GiaCoBan = v.GiaCoBan,
                DungLuongPin = v.DungLuongPin,
                QuangDuongDiChuyen = v.QuangDuongDiChuyen,
                SoChoNgoi = (int?)v.SoChoNgoi,
                HinhAnh = GetFullImageUrl(v.AnhRaw)
            }).ToList();
        }

        public async Task<List<CarCompareDto>> GetVersionsToCompareAsync(List<long> ids)
        {
            var versions = await _context.CarVersions
        .Where(v => ids.Contains(v.Id))
        .Include(v => v.Xe)
        .ThenInclude(x => x.CarImages)
        .Select(v => new
        {
            Id = v.Id, // Đổi ở đây
            TenMauXe = v.Xe.MauXe,
            TenPhienBan = v.TenPhienBan, // Bỏ v. ở bên trái
            GiaCoBan = v.GiaCoBan,
            DungLuongPin = v.DungLuongPin,
            QuangDuongDiChuyen = v.QuangDuongDiChuyen,
            SoChoNgoi = v.SoChoNgoi,
            AnhRaw = v.Xe.CarImages
                        .Where(img => img.LoaiAnh == "main")
                        .Select(img => img.DuongDanHinhAnh)
                        .FirstOrDefault()
        }).ToListAsync();

            return versions.Select(v => new CarCompareDto
            {
                Id = v.Id,
                TenMauXe = v.TenMauXe,
                TenPhienBan = v.TenPhienBan,
                GiaCoBan = v.GiaCoBan,
                DungLuongPin = v.DungLuongPin,
                QuangDuongDiChuyen = v.QuangDuongDiChuyen,
                SoChoNgoi = (int?)v.SoChoNgoi,
                HinhAnh = GetFullImageUrl(v.AnhRaw)
            }).ToList();
        }
    }
}