using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class Payment
{
    public long Id { get; set; }

    public long DonHangId { get; set; }

    public decimal SoTienThanhToan { get; set; }

    public string PhuongThucThanhToan { get; set; } = null!;

    public string TrangThaiThanhToan { get; set; } = null!;

    public string MaGiaoDich { get; set; } = null!;

    public string DuongDanThanhToan { get; set; } = null!;

    public DateTime? ThoiGianTao { get; set; }

    public virtual Order DonHang { get; set; } = null!;
}
