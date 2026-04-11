using Web_ban_xe_VinFast.DTOs.Order;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Web_ban_xe_VinFast.Services.Interfaces;



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

        public async Task<List<CartItem>> GetCartAsync(long userId)
            => await _context.CartItems
                .Include(c => c.Xe)
                .Where(c => c.NguoiDungId == userId)
                .ToListAsync();

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
