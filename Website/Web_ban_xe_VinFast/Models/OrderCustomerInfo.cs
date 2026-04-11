using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class OrderCustomerInfo
{
    public long Id { get; set; }

    public long DonHangId { get; set; }

    public string HoTen { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string DiaChiKhachHang { get; set; } = null!;

    public string SoCccd { get; set; } = null!;

    public virtual Order DonHang { get; set; } = null!;
}
