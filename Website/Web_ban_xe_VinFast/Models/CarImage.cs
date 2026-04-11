using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class CarImage
{
    public long Id { get; set; }

    public long XeId { get; set; }

    public string DuongDanHinhAnh { get; set; } = null!;

    public string LoaiAnh { get; set; } = null!;

    public short? ThuTuSapXep { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual Car Xe { get; set; } = null!;
}
