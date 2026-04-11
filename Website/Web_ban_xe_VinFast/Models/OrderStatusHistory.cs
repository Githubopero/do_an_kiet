using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class OrderStatusHistory
{
    public long Id { get; set; }

    public long DonHangId { get; set; }

    public string TrangThai { get; set; } = null!;

    public long? NguoiCapNhat { get; set; }

    public DateTime? ThoiGianCapNhat { get; set; }

    public virtual Order DonHang { get; set; } = null!;

    public virtual User? NguoiCapNhatNavigation { get; set; }
}
