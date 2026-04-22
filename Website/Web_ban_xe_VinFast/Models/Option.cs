using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Option
{
    public long Id { get; set; }

    public long XeId { get; set; }

    public string LoaiTuyChon { get; set; } = null!;

    public string TenTuyChon { get; set; } = null!;

    public decimal? AnhHuongDenGia { get; set; }

    public bool? TrangThaiKhaDung { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual Car Xe { get; set; } = null!;
}
