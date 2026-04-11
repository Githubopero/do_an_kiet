using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class CarConfiguration
{
    public long Id { get; set; }

    public long XeId { get; set; }

    public long? PhienBanId { get; set; }

    public string MauNgoaiThat { get; set; } = null!;

    public string MauNoiThat { get; set; } = null!;

    public string LoaiPin { get; set; } = null!;

    public string LoaiNoiThat { get; set; } = null!;

    public decimal TongGia { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual CarVersion? PhienBan { get; set; }

    public virtual Car Xe { get; set; } = null!;
}
