using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Dealer
{
    public long Id { get; set; }

    public string TenDaiLy { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    public string SoDienThoaiDaiLy { get; set; } = null!;

    public string TinhThanhPho { get; set; } = null!;

    public DateTime? ThoiGianTao { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<DealerInventory> DealerInventories { get; set; } = new List<DealerInventory>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
