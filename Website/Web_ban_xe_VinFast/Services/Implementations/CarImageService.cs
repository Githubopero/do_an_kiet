using Web_ban_xe_VinFast.DTOs.CarImage;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CarImageService:ICarImageService
    {
        private readonly VinFastDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CarImageService(VinFastDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<List<CarImageDto>> GetAllImagesAsync()
        {
            return await _context.CarImages
                .Include(i => i.Xe)
                .Select(i => new CarImageDto
                {
                    Id = i.Id,
                    XeId = i.XeId,
                    MauXe = i.Xe.MauXe,
                    DuongDanHinhAnh = i.DuongDanHinhAnh,
                    LoaiAnh = i.LoaiAnh,
                    ThuTuSapXep = i.ThuTuSapXep
                }).ToListAsync();
        }

        public async Task<List<CarImageDto>> GetImagesByCarIdAsync(long carId)
        {
            return await _context.CarImages
                .Where(i => i.XeId == carId)
                .Select(i => new CarImageDto
                {
                    Id = i.Id,
                    XeId = i.XeId,
                    DuongDanHinhAnh = i.DuongDanHinhAnh,
                    LoaiAnh = i.LoaiAnh,
                    ThuTuSapXep = i.ThuTuSapXep
                }).ToListAsync();
        }

        public async Task<CarImageDto> AddImageAsync(UploadCarImageRequest req)
        {
            if (req.File == null) throw new Exception("Vui lòng chọn file ảnh");

            string fileName = await SaveFile(req.File);
            var image = new CarImage
            {
                XeId = req.XeId,
                DuongDanHinhAnh = "/uploads/" + fileName,
                LoaiAnh = req.LoaiAnh,
                ThuTuSapXep = req.ThuTuSapXep
            };

            _context.CarImages.Add(image);
            await _context.SaveChangesAsync();

            return new CarImageDto { Id = image.Id, DuongDanHinhAnh = image.DuongDanHinhAnh };
        }

        public async Task UpdateImageAsync(long id, UploadCarImageRequest req)
        {
            var image = await _context.CarImages.FindAsync(id);
            if (image == null) throw new Exception("Ảnh không tồn tại");

            if (req.File != null)
            {
                // Xóa ảnh cũ nếu có file mới
                DeleteOldFile(image.DuongDanHinhAnh);
                image.DuongDanHinhAnh = "/uploads/" + await SaveFile(req.File);
            }

            image.LoaiAnh = req.LoaiAnh;
            image.ThuTuSapXep = req.ThuTuSapXep;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteImageAsync(long id)
        {
            var image = await _context.CarImages.FindAsync(id);
            if (image == null) throw new Exception("Ảnh không tồn tại");

            DeleteOldFile(image.DuongDanHinhAnh);
            _context.CarImages.Remove(image);
            await _context.SaveChangesAsync();
        }

        // Hàm helper xử lý lưu file
        private async Task<string> SaveFile(IFormFile file)
        {
            string uploadDir = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(uploadDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;
        }

        private void DeleteOldFile(string relativePath)
        {
            string fullPath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}
