using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class CartItem
{
    public long Id { get; set; }

    public long NguoiDungId { get; set; }

    public long XeId { get; set; }

    public string CauHinhXe { get; set; } = null!;

    public decimal Gia { get; set; }

    public int? SoLuong { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual User NguoiDung { get; set; } = null!;

    public virtual Car Xe { get; set; } = null!;
}
