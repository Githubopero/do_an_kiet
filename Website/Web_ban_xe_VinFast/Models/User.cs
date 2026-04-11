using System;
using System.Collections.Generic;

namespace Web_ban_xe_VinFast.Models;

public partial class User
{
    public long Id { get; set; }

    public string HoTen { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string SoDienThoai { get; set; } = null!;

    public string MatKhauHash { get; set; } = null!;

    public string VaiTro { get; set; } = null!;

    public string TrangThaiTaiKhoan { get; set; } = null!;

    public int? SoLanNhapSai { get; set; }

    public DateTime ThoiGianKhoaTaiKhoan { get; set; }

    public DateTime? ThoiGianTao { get; set; }

    public DateTime? ThoiGianCapNhat { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
