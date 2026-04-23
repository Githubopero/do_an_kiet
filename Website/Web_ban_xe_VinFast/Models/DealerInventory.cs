using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class DealerInventory
{
    public long Id { get; set; }

    public long DaiLyId { get; set; }

    public long XeId { get; set; }

    //public string CauHinhXe { get; set; } = null!;

    public int SoLuongTonKho { get; set; }

    public int? NguongCanhBaoTonThap { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public virtual Dealer DaiLy { get; set; } = null!;

    public virtual Car Xe { get; set; } = null!;
}
