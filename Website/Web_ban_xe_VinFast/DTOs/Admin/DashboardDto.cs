namespace Web_ban_xe_VinFast.DTOs.Admin
{
    public class DashboardDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public List<TopCarDto> TopSellingCars { get; set; } = new();
    }
}
