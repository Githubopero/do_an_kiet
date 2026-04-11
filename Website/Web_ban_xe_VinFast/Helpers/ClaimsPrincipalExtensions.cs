using System.Security.Claims;

namespace Web_ban_xe_VinFast.Helpers
{
    public static class ClaimsPrincipalExtensions
    {
        public static long GetUserId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? long.Parse(claim.Value) : 0;
        }

        // Thêm hàm này để lấy DealerId
        public static long GetDealerId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("DealerId");
            return claim != null ? long.Parse(claim.Value) : 0;
        }
    }
}
