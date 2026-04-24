using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class OrderItem
{
    public long Id { get; set; }

    public long DonHangId { get; set; }

    public long XeId { get; set; }

    public string CauHinhXe { get; set; } = null!;

    public decimal Gia { get; set; }

    public int? SoLuong { get; set; }
    public long PhienBanId { get; set; } // Thêm dòng này
    public virtual CarVersion PhienBan { get; set; } = null!; // Thêm dòng này

    public virtual Order DonHang { get; set; } = null!;

    public virtual Car Xe { get; set; } = null!;
}
