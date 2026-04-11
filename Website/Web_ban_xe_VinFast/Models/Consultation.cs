using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Consultation
{
    public long Id { get; set; }

    public long? NguoiDungId { get; set; }

    public string HoTen { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string MauXeQuanTam { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    public string MucDoUuTien { get; set; } = null!;

    public string AnhDinhKem { get; set; } = null!;

    public string MaTracking { get; set; } = null!;

    public string TrangThaiXyLy { get; set; } = null!;

    public DateTime? ThoiGianTao { get; set; }

    public virtual User? NguoiDung { get; set; }
}
