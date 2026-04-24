using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class CarVersion
{
    public long Id { get; set; }

    public long XeId { get; set; }

    public string TenPhienBan { get; set; } = null!;

    public decimal GiaCoBan { get; set; }

    public float DungLuongPin { get; set; }

    public int QuangDuongDiChuyen { get; set; }

    public sbyte? SoChoNgoi { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public bool IsDeleted { get; set; } = false;

    public virtual ICollection<CarConfiguration> CarConfigurations { get; set; } = new List<CarConfiguration>();
    // Thêm mới liên kết ngược lại bảng kho
    public virtual ICollection<DealerInventory> DealerInventories { get; set; } = new List<DealerInventory>();
    // THÊM DÒNG NÀY: Liên kết ngược lại các mục trong đơn hàng
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Car Xe { get; set; } = null!;
}
