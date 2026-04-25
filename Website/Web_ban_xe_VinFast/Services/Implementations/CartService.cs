using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text.Json;
using Web_ban_xe_VinFast.DTOs.Car;
using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;
using Web_ban_xe_VinFast.Services.Interfaces;



namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CartService:ICartService
    {
        private readonly VinFastDbContext _context;
        private readonly ICarService _carService; // Tiêm CarService để dùng hàm CalculatePrice

        public CartService(VinFastDbContext context, ICarService carService)
        {
            _context = context;
            _carService = carService; // Gán giá trị
        }


        public async Task<string> AddToCartAsync(long userId, AddToCartRequest req)
        {
            // Bổ sung option này để chấp nhận cả phienBanId lẫn PhienBanId
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            // 1. Giải mã JSON (Bổ sung Option để không phân biệt hoa thường từ FE gửi lên)
            var configObj = JsonSerializer.Deserialize<ConfigPriceRequest>(req.CauHinhXeJson, options);

            if (configObj == null) throw new Exception("Dữ liệu cấu hình không hợp lệ");
            // Gán thủ công nếu XeId trong JSON bị thiếu hoặc bằng 0
            if (configObj.XeId == 0)
            {
                configObj.XeId = req.XeId;
            }

            // 2. Tính toán giá (Giữ nguyên)
            var priceDetail = await _carService.CalculatePriceAsync(configObj);

            // 3. Chuẩn hóa JSON - Ép các Key về PascalCase cố định để so khớp chuỗi String trong DB
            var normalizedConfigJson = JsonSerializer.Serialize(new
            {
                PhienBanId = configObj.PhienBanId,
                MauNgoaiThat = configObj.MauNgoaiThat,
                MauNoiThat = configObj.MauNoiThat,
                LoaiPin = configObj.LoaiPin,
                LoaiNoiThat = configObj.LoaiNoiThat
            });

            // 4. Tìm kiếm item (Sử dụng chuỗi đã chuẩn hóa)
            var existing = await _context.CartItems
                .FirstOrDefaultAsync(c => c.NguoiDungId == userId
                                       && c.XeId == req.XeId
                                       && c.CauHinhXe == normalizedConfigJson);

            if (existing != null)
            {
                existing.SoLuong += 1;
                existing.Gia = priceDetail.TongGia;
            }
            else
            {
                _context.CartItems.Add(new CartItem
                {
                    NguoiDungId = userId,
                    XeId = req.XeId,
                    CauHinhXe = normalizedConfigJson,
                    Gia = priceDetail.TongGia,
                    SoLuong = 1,
                    ThoiGianTao = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return existing != null ? "Đã cập nhật số lượng" : "Đã thêm vào giỏ hàng";
        }

        public async Task<List<CartItemDto>> GetCartAsync(long userId)
        {
            var items = await _context.CartItems
        .Where(c => c.NguoiDungId == userId)
        .Include(c => c.Xe)
            .ThenInclude(x => x.CarImages)
        .AsNoTracking()
        .ToListAsync();

            var result = new List<CartItemDto>();

            foreach (var item in items)
            {
                // Giải mã JSON thành Dictionary
                var config = JsonSerializer.Deserialize<Dictionary<string, object>>(item.CauHinhXe ?? "{}")
                             ?? new Dictionary<string, object>();

                var rawImage = item.Xe.CarImages.OrderBy(i => i.ThuTuSapXep).Select(i => i.DuongDanHinhAnh).FirstOrDefault();

                result.Add(new CartItemDto
                {
                    Id = item.Id,
                    XeId = item.XeId,
                    MauXe = item.Xe.MauXe,
                    DuongDanHinhAnh = GetFullImageUrl(rawImage),

                    // SỬA KEY Ở ĐÂY: Dùng viết hoa chữ cái đầu cho khớp với phần lưu ở trên
                    // Dùng .ToString() vì giá trị trong Dictionary là object
                    PhienBan = config.GetValueOrDefault("PhienBanId", "N/A")?.ToString(),
                    MauNgoaiThat = config.GetValueOrDefault("MauNgoaiThat", "")?.ToString(),
                    MauNoiThat = config.GetValueOrDefault("MauNoiThat", "")?.ToString(),
                    LoaiPin = config.GetValueOrDefault("LoaiPin", "")?.ToString(),
                    LoaiNoiThat = config.GetValueOrDefault("LoaiNoiThat", "")?.ToString(),

                    Gia = item.Gia,
                    SoLuong = item.SoLuong
                });
            }

            return result;
        }
        // Hàm bổ trợ xử lý URL ảnh (nên để ở một nơi dùng chung nếu có thể)
        private string GetFullImageUrl(string? path)
        {
            if (string.IsNullOrEmpty(path)) return "";
            if (path.StartsWith("http")) return path;
            string fileName = path.Replace("uploads/", "").Replace("uploads\\", "");
            return $"http://localhost:5130/uploads/{fileName}";
        }

        public async Task RemoveItemAsync(long userId, long cartItemId)
        {
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.NguoiDungId == userId);
            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
