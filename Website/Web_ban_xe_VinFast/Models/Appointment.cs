using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Appointment
{
    public long Id { get; set; }

    public long NguoiDungId { get; set; }

    public long DaiLyId { get; set; }

    public DateTime NgayGioHen { get; set; }

    public string? GhiChu { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime? ThoiGianTao { get; set; }

    public virtual Dealer DaiLy { get; set; } = null!;

    public virtual User NguoiDung { get; set; } = null!;
}
