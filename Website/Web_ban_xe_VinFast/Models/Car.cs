using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Car
{
    public long Id { get; set; }

    public string MauXe { get; set; } = null!;

    public string? MoTa { get; set; }

    public string TrangThaiHoatDong { get; set; } = null!;

    public DateTime? ThoiGianTao { get; set; }

    public virtual ICollection<CarConfiguration> CarConfigurations { get; set; } = new List<CarConfiguration>();

    public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();

    public virtual ICollection<CarVersion> CarVersions { get; set; } = new List<CarVersion>();

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<DealerInventory> DealerInventories { get; set; } = new List<DealerInventory>();

    public virtual ICollection<Option> Options { get; set; } = new List<Option>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
