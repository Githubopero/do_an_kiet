using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Web_ban_xe_VinFast.Models;

public partial class VinFastDbContext : DbContext
{
    public VinFastDbContext()
    {
    }

    public VinFastDbContext(DbContextOptions<VinFastDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Car> Cars { get; set; }

    public virtual DbSet<CarConfiguration> CarConfigurations { get; set; }

    public virtual DbSet<CarImage> CarImages { get; set; }

    public virtual DbSet<CarVersion> CarVersions { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Consultation> Consultations { get; set; }

    public virtual DbSet<Dealer> Dealers { get; set; }

    public virtual DbSet<DealerInventory> DealerInventories { get; set; }

    public virtual DbSet<Option> Options { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderCustomerInfo> OrderCustomerInfos { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=do_an_kiet;user=root;password=ms0388@", Microsoft.EntityFrameworkCore.ServerVersion.Parse("9.5.0-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("appointments");

            entity.HasIndex(e => e.DaiLyId, "dai_ly_id");

            entity.HasIndex(e => e.NguoiDungId, "nguoi_dung_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DaiLyId).HasColumnName("dai_ly_id");
            entity.Property(e => e.GhiChu)
                .HasColumnType("text")
                .HasColumnName("ghi_chu");
            entity.Property(e => e.NgayGioHen)
                .HasColumnType("datetime")
                .HasColumnName("ngay_gio_hen");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThai)
                .HasDefaultValueSql("'Scheduled'")
                .HasColumnType("enum('Scheduled','Completed','Cancelled')")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.DaiLy).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.DaiLyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_ibfk_2");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.NguoiDungId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_ibfk_1");
        });

        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cars");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.MauXe)
                .HasMaxLength(100)
                .HasColumnName("mau_xe");
            entity.Property(e => e.MoTa)
                .HasColumnType("text")
                .HasColumnName("mo_ta");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThaiHoatDong)
                .HasDefaultValueSql("'active'")
                .HasColumnType("enum('active','inactive')")
                .HasColumnName("trang_thai_hoat_dong");
        });

        modelBuilder.Entity<CarConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("car_configurations");

            entity.HasIndex(e => e.PhienBanId, "phien_ban_id");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.LoaiNoiThat)
                .HasMaxLength(100)
                .HasColumnName("loai_noi_that");
            entity.Property(e => e.LoaiPin)
                .HasMaxLength(100)
                .HasColumnName("loai_pin");
            entity.Property(e => e.MauNgoaiThat)
                .HasMaxLength(100)
                .HasColumnName("mau_ngoai_that");
            entity.Property(e => e.MauNoiThat)
                .HasMaxLength(100)
                .HasColumnName("mau_noi_that");
            entity.Property(e => e.PhienBanId).HasColumnName("phien_ban_id");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TongGia)
                .HasPrecision(15, 2)
                .HasColumnName("tong_gia");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.PhienBan).WithMany(p => p.CarConfigurations)
                .HasForeignKey(d => d.PhienBanId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("car_configurations_ibfk_2");

            entity.HasOne(d => d.Xe).WithMany(p => p.CarConfigurations)
                .HasForeignKey(d => d.XeId)
                .HasConstraintName("car_configurations_ibfk_1");
        });

        modelBuilder.Entity<CarImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("car_images");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DuongDanHinhAnh)
                .HasMaxLength(500)
                .HasColumnName("duong_dan_hinh_anh");
            entity.Property(e => e.LoaiAnh)
                .HasDefaultValueSql("'gallery'")
                .HasColumnType("enum('main','gallery','video_thumbnail')")
                .HasColumnName("loai_anh");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.ThuTuSapXep)
                .HasDefaultValueSql("'0'")
                .HasColumnName("thu_tu_sap_xep");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.Xe).WithMany(p => p.CarImages)
                .HasForeignKey(d => d.XeId)
                .HasConstraintName("car_images_ibfk_1");
        });

        modelBuilder.Entity<CarVersion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("car_versions");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DungLuongPin).HasColumnName("dung_luong_pin");
            entity.Property(e => e.GiaCoBan)
                .HasPrecision(15, 2)
                .HasColumnName("gia_co_ban");
            entity.Property(e => e.QuangDuongDiChuyen).HasColumnName("quang_duong_di_chuyen");
            entity.Property(e => e.SoChoNgoi)
                .HasDefaultValueSql("'5'")
                .HasColumnName("so_cho_ngoi");
            entity.Property(e => e.TenPhienBan)
                .HasMaxLength(100)
                .HasColumnName("ten_phien_ban");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.Xe).WithMany(p => p.CarVersions)
                .HasForeignKey(d => d.XeId)
                .HasConstraintName("car_versions_ibfk_1");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cart_items");

            entity.HasIndex(e => e.NguoiDungId, "nguoi_dung_id");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CauHinhXe)
                .HasColumnType("json")
                .HasColumnName("cau_hinh_xe");
            entity.Property(e => e.Gia)
                .HasPrecision(15, 2)
                .HasColumnName("gia");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(e => e.SoLuong)
                .HasDefaultValueSql("'1'")
                .HasColumnName("so_luong");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.NguoiDungId)
                .HasConstraintName("cart_items_ibfk_1");

            entity.HasOne(d => d.Xe).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.XeId)
                .HasConstraintName("cart_items_ibfk_2");
        });

        modelBuilder.Entity<Consultation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("consultations");

            entity.HasIndex(e => e.MaTracking, "ma_tracking").IsUnique();

            entity.HasIndex(e => e.NguoiDungId, "nguoi_dung_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnhDinhKem)
                .HasMaxLength(500)
                .HasColumnName("anh_dinh_kem");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(255)
                .HasColumnName("ho_ten");
            entity.Property(e => e.MaTracking)
                .HasMaxLength(50)
                .HasColumnName("ma_tracking");
            entity.Property(e => e.MauXeQuanTam)
                .HasMaxLength(100)
                .HasColumnName("mau_xe_quan_tam");
            entity.Property(e => e.MucDoUuTien)
                .HasDefaultValueSql("'NORMAL'")
                .HasColumnType("enum('NORMAL','HIGH')")
                .HasColumnName("muc_do_uu_tien");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(e => e.NoiDung)
                .HasColumnType("text")
                .HasColumnName("noi_dung");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThaiXyLy)
                .HasDefaultValueSql("'New'")
                .HasColumnType("enum('New','InProgress','Resolved')")
                .HasColumnName("trang_thai_xy_ly");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.Consultations)
                .HasForeignKey(d => d.NguoiDungId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("consultations_ibfk_1");
        });

        modelBuilder.Entity<Dealer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dealers");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DiaChi)
                .HasColumnType("text")
                .HasColumnName("dia_chi");
            entity.Property(e => e.SoDienThoaiDaiLy)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai_dai_ly");
            entity.Property(e => e.TenDaiLy)
                .HasMaxLength(255)
                .HasColumnName("ten_dai_ly");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TinhThanhPho)
                .HasMaxLength(100)
                .HasColumnName("tinh_thanh_pho");
        });

        modelBuilder.Entity<DealerInventory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("dealer_inventory");

            entity.HasIndex(e => e.DaiLyId, "dai_ly_id");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CauHinhXe)
                .HasColumnType("json")
                .HasColumnName("cau_hinh_xe");
            entity.Property(e => e.DaiLyId).HasColumnName("dai_ly_id");
            entity.Property(e => e.NguongCanhBaoTonThap)
                .HasDefaultValueSql("'5'")
                .HasColumnName("nguong_canh_bao_ton_thap");
            entity.Property(e => e.SoLuongTonKho).HasColumnName("so_luong_ton_kho");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.DaiLy).WithMany(p => p.DealerInventories)
                .HasForeignKey(d => d.DaiLyId)
                .HasConstraintName("dealer_inventory_ibfk_1");

            entity.HasOne(d => d.Xe).WithMany(p => p.DealerInventories)
                .HasForeignKey(d => d.XeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("dealer_inventory_ibfk_2");
        });

        modelBuilder.Entity<Option>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("options");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnhHuongDenGia)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("'0.00'")
                .HasColumnName("anh_huong_den_gia");
            entity.Property(e => e.GiaOption)
                .HasMaxLength(100)
                .HasColumnName("gia_option");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThaiKhaDung)
                .HasDefaultValueSql("'1'")
                .HasColumnName("trang_thai_kha_dung");
            entity.Property(e => e.TuyChonXe)
                .HasColumnType("enum('exterior_color','interior_color','battery_type','interior_type')")
                .HasColumnName("tuy_chon_xe");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.Xe).WithMany(p => p.Options)
                .HasForeignKey(d => d.XeId)
                .HasConstraintName("options_ibfk_1");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orders");

            entity.HasIndex(e => e.DaiLyId, "dai_ly_id");

            entity.HasIndex(e => e.NguoiDungId, "nguoi_dung_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DaiLyId).HasColumnName("dai_ly_id");
            entity.Property(e => e.NguoiDungId).HasColumnName("nguoi_dung_id");
            entity.Property(e => e.SoTienDatCoc)
                .HasPrecision(15, 2)
                .HasColumnName("so_tien_dat_coc");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TongTien)
                .HasPrecision(15, 2)
                .HasColumnName("tong_tien");
            entity.Property(e => e.TrangThaiDonHang)
                .HasDefaultValueSql("'Pending'")
                .HasColumnType("enum('Pending','Paid','Confirmed','InProduction','Delivered','Cancelled')")
                .HasColumnName("trang_thai_don_hang");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.DaiLy).WithMany(p => p.Orders)
                .HasForeignKey(d => d.DaiLyId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("orders_ibfk_2");

            entity.HasOne(d => d.NguoiDung).WithMany(p => p.Orders)
                .HasForeignKey(d => d.NguoiDungId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orders_ibfk_1");
        });

        modelBuilder.Entity<OrderCustomerInfo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_customer_info");

            entity.HasIndex(e => e.DonHangId, "don_hang_id").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DiaChiKhachHang)
                .HasColumnType("text")
                .HasColumnName("dia_chi_khach_hang");
            entity.Property(e => e.DonHangId).HasColumnName("don_hang_id");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(255)
                .HasColumnName("ho_ten");
            entity.Property(e => e.SoCccd)
                .HasMaxLength(20)
                .HasColumnName("so_CCCD");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai");

            entity.HasOne(d => d.DonHang).WithOne(p => p.OrderCustomerInfo)
                .HasForeignKey<OrderCustomerInfo>(d => d.DonHangId)
                .HasConstraintName("order_customer_info_ibfk_1");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_items");

            entity.HasIndex(e => e.DonHangId, "don_hang_id");

            entity.HasIndex(e => e.XeId, "xe_id");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CauHinhXe)
                .HasColumnType("json")
                .HasColumnName("cau_hinh_xe");
            entity.Property(e => e.DonHangId).HasColumnName("don_hang_id");
            entity.Property(e => e.Gia)
                .HasPrecision(15, 2)
                .HasColumnName("gia");
            entity.Property(e => e.SoLuong)
                .HasDefaultValueSql("'1'")
                .HasColumnName("so_luong");
            entity.Property(e => e.XeId).HasColumnName("xe_id");

            entity.HasOne(d => d.DonHang).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.DonHangId)
                .HasConstraintName("order_items_ibfk_2");

            entity.HasOne(d => d.Xe).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.XeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("order_items_ibfk_1");
        });

        modelBuilder.Entity<OrderStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_status_history");

            entity.HasIndex(e => e.DonHangId, "don_hang_id");

            entity.HasIndex(e => e.NguoiCapNhat, "nguoi_cap_nhat");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonHangId).HasColumnName("don_hang_id");
            entity.Property(e => e.NguoiCapNhat).HasColumnName("nguoi_cap_nhat");
            entity.Property(e => e.ThoiGianCapNhat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_cap_nhat");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.DonHang).WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.DonHangId)
                .HasConstraintName("order_status_history_ibfk_1");

            entity.HasOne(d => d.NguoiCapNhatNavigation).WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.NguoiCapNhat)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("order_status_history_ibfk_2");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("payments");

            entity.HasIndex(e => e.DonHangId, "don_hang_id");

            entity.HasIndex(e => e.MaGiaoDich, "ma_giao_dich").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DonHangId).HasColumnName("don_hang_id");
            entity.Property(e => e.DuongDanThanhToan)
                .HasMaxLength(500)
                .HasColumnName("duong_dan_thanh_toan");
            entity.Property(e => e.MaGiaoDich)
                .HasMaxLength(100)
                .HasColumnName("ma_giao_dich");
            entity.Property(e => e.PhuongThucThanhToan)
                .HasMaxLength(50)
                .HasColumnName("phuong_thuc_thanh_toan");
            entity.Property(e => e.SoTienThanhToan)
                .HasPrecision(15, 2)
                .HasColumnName("so_tien_thanh_toan");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThaiThanhToan)
                .HasDefaultValueSql("'Pending'")
                .HasColumnType("enum('Pending','Success','Failed','Refunded')")
                .HasColumnName("trang_thai_thanh_toan");

            entity.HasOne(d => d.DonHang).WithMany(p => p.Payments)
                .HasForeignKey(d => d.DonHangId)
                .HasConstraintName("payments_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.SoDienThoai, "so_dien_thoai").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.HoTen)
                .HasMaxLength(255)
                .HasColumnName("ho_ten");
            entity.Property(e => e.MatKhauHash)
                .HasMaxLength(255)
                .HasColumnName("mat_khau_hash");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.SoLanNhapSai)
                .HasDefaultValueSql("'0'")
                .HasColumnName("so_lan_nhap_sai");
            entity.Property(e => e.ThoiGianCapNhat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_cap_nhat");
            entity.Property(e => e.ThoiGianKhoaTaiKhoan)
                .HasColumnType("datetime")
                .HasColumnName("thoi_gian_khoa_tai_khoan");
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("thoi_gian_tao");
            entity.Property(e => e.TrangThaiTaiKhoan)
                .HasDefaultValueSql("'ACTIVE'")
                .HasColumnType("enum('ACTIVE','LOCKED','INACTIVE')")
                .HasColumnName("trang_thai_tai_khoan");
            entity.Property(e => e.VaiTro)
                .HasDefaultValueSql("'Customer'")
                .HasColumnType("enum('Customer','DealerStaff','Admin')")
                .HasColumnName("vai_tro");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
