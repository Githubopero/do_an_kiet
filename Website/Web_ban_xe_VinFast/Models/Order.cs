using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Order
{
    public long Id { get; set; }

    public long NguoiDungId { get; set; }

    public long? DaiLyId { get; set; }

    public string TrangThaiDonHang { get; set; } = null!;

    public decimal SoTienDatCoc { get; set; }

    public decimal TongTien { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Dealer? DaiLy { get; set; }

    public virtual User NguoiDung { get; set; } = null!;

    public virtual OrderCustomerInfo? OrderCustomerInfo { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
