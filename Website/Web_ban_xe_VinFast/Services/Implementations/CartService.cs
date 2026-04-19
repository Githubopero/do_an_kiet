using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;
using System.Text.Json;
using System.Collections.Generic;



namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class CartService:ICartService
    {
        private readonly VinFastDbContext _context;

        public CartService(VinFastDbContext context) => _context = context;

        public async Task<string> AddToCartAsync(long userId, AddToCartRequest req)
        {
            var existing = await _context.CartItems
                .FirstOrDefaultAsync(c => c.NguoiDungId == userId && c.XeId == req.XeId);

            if (existing != null)
            {
                // Logic "thay thế" theo sequence diagram
                existing.CauHinhXe = req.CauHinhXeJson;
                existing.Gia = req.Gia;
                existing.SoLuong = 1;
            }
            else
            {
                _context.CartItems.Add(new CartItem
                {
                    NguoiDungId = userId,
                    XeId = req.XeId,
                    CauHinhXe = req.CauHinhXeJson,
                    Gia = req.Gia,
                    SoLuong = 1,
                    ThoiGianTao = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return existing != null ? "Đã cập nhật giỏ hàng" : "Đã thêm vào giỏ hàng";
        }

        public async Task<List<CartItemDto>> GetCartAsync(long userId)
        {
            var items = await _context.CartItems
                .Where(c => c.NguoiDungId == userId)
                .Include(c => c.Xe)
                    .ThenInclude(x => x.CarImages)   // ← Quan trọng: Load ảnh xe
                .AsNoTracking()
                .ToListAsync();

            var result = new List<CartItemDto>();

            foreach (var item in items)
            {
                var config = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(item.CauHinhXe ?? "{}")
                             ?? new Dictionary<string, string>();

                // Lấy ảnh chính của xe (ưu tiên ảnh có thứ tự nhỏ nhất)
                var mainImage = item.Xe.CarImages
                    .OrderBy(i => i.ThuTuSapXep)
                    .FirstOrDefault()?.DuongDanHinhAnh ?? "";

                result.Add(new CartItemDto
                {
                    Id = item.Id,
                    XeId = item.XeId,
                    MauXe = item.Xe.MauXe,
                    DuongDanHinhAnh = mainImage,          // ← Ảnh sẽ có ở đây

                    PhienBan = config.GetValueOrDefault("phienBanId", "N/A"),
                    MauNgoaiThat = config.GetValueOrDefault("mauNgoaiThat", ""),
                    MauNoiThat = config.GetValueOrDefault("mauNoiThat", ""),
                    LoaiPin = config.GetValueOrDefault("loaiPin", ""),
                    LoaiNoiThat = config.GetValueOrDefault("loaiNoiThat", ""),

                    Gia = item.Gia,
                    SoLuong = item.SoLuong
                });
            }

            return result;
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
