using Web_ban_xe_VinFast.DTOs.Payment;
using Web_ban_xe_VinFast.Helpers;
using Web_ban_xe_VinFast.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Web_ban_xe_VinFast.Services.Interfaces;

namespace Web_ban_xe_VinFast.Services.Implementations
{
    public class PaymentService:IPaymentService
    {
        private readonly VinFastDbContext _context;
        private readonly IConfiguration _config;
        private readonly string _vnpUrl;
        private readonly string _vnpHashSecret;
        private readonly string _vnpTmnCode;
        private readonly string _vnpReturnUrl;
        private readonly string _vnpIpnUrl;

        public PaymentService(VinFastDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

            _vnpUrl = _config["Vnpay:Url"]!;
            _vnpHashSecret = _config["Vnpay:HashSecret"]!;
            _vnpTmnCode = _config["Vnpay:TmnCode"]!;
            _vnpReturnUrl = _config["Vnpay:ReturnUrl"]!;
            _vnpIpnUrl = _config["Vnpay:IpnUrl"]!;
        }

        public async Task<PaymentResponse> CreatePaymentAsync(CreatePaymentRequest req, string clientIp)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == req.OrderId);

            if (order == null) throw new Exception("Không tìm thấy đơn hàng");

            if (order.TrangThaiDonHang != "Pending")
                throw new Exception("Đơn hàng không ở trạng thái chờ thanh toán");

            var vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", _vnpTmnCode);
            vnpay.AddRequestData("vnp_Amount", ((long)(order.SoTienDatCoc * 100)).ToString()); // ×100
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", clientIp);
            vnpay.AddRequestData("vnp_Locale", req.Locale);
            vnpay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang VinFast #{order.Id}");
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _vnpReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", order.Id.ToString());

            if (!string.IsNullOrEmpty(req.BankCode))
                vnpay.AddRequestData("vnp_BankCode", req.BankCode);
            // Thêm thời hạn thanh toán (tùy chọn nhưng nên có)
            vnpay.AddRequestData("vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss"));

            string paymentUrl = vnpay.CreateRequestUrl(_vnpUrl, _vnpHashSecret);

            // Tạo bản ghi Payment
            var payment = new Payment
            {
                DonHangId = order.Id,
                SoTienThanhToan = order.SoTienDatCoc,
                PhuongThucThanhToan = "VNPAY",
                TrangThaiThanhToan = "Pending",
                MaGiaoDich = order.Id.ToString(),
                DuongDanThanhToan = paymentUrl,
                ThoiGianTao = DateTime.Now
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return new PaymentResponse
            {
                PaymentUrl = paymentUrl,
                Message = "Tạo link thanh toán thành công"
            };
        }

        // Xử lý Return URL (cho user xem kết quả)
        public async Task<(bool Success, string Message)> ProcessReturnAsync(VnpayReturnDto dto, IQueryCollection queryParameters)
        {
            var vnpay = new VnPayLibrary();

            // Duyệt qua tất cả các tham số mà VNPAY gửi về trong URL
            foreach (var (key, value) in queryParameters)
            {
                // Chỉ lấy các tham số bắt đầu bằng "vnp_" và bỏ qua các tham số chữ ký
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_")
                    && key != "vnp_SecureHash" && key != "vnp_SecureHashType")
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            // HashSecret phải khớp 100% với appsettings: 9PNAHAR6DKT617AOJ78RR4IEOH13XC1J
            bool checkSignature = vnpay.ValidateSignature(dto.vnp_SecureHash, _vnpHashSecret);

            if (checkSignature)
            {
                if (dto.vnp_ResponseCode == "00")
                {
                    // Cập nhật Database ở đây (như đoạn code bạn đã comment)
                    var order = await _context.Orders.FindAsync(long.Parse(dto.vnp_TxnRef));
                    if (order != null)
                    {
                        order.TrangThaiDonHang = "Paid";
                        // ... lưu logic thanh toán ...
                        await _context.SaveChangesAsync();
                    }
                    return (true, "Thanh toán thành công");
                }
                return (false, "Giao dịch thất bại (Mã lỗi: " + dto.vnp_ResponseCode + ")");
            }

            return (false, "Chữ ký VNPAY không hợp lệ (Sai Hash)");
        }
        //public async Task<(bool Success, string Message)> ProcessReturnAsync(VnpayReturnDto dto)
        //{
        //    var vnpay = new VnPayLibrary();

        //    // Lấy toàn bộ Query String từ URL thực tế để đảm bảo thứ tự tham số chuẩn nhất
        //    foreach (var prop in dto.GetType().GetProperties())
        //    {
        //        string name = prop.Name;
        //        string value = prop.GetValue(dto)?.ToString();

        //        // CHỈ thêm các tham số bắt đầu bằng vnp_ và KHÔNG PHẢI là vnp_SecureHash
        //        if (!string.IsNullOrEmpty(value) && name.StartsWith("vnp_") && name != "vnp_SecureHash" && name != "vnp_SecureHashType")
        //        {
        //            vnpay.AddResponseData(name, value);
        //        }
        //    }

        //    // HashSecret lấy từ appsettings (9PNAHAR...)
        //    bool checkSignature = vnpay.ValidateSignature(dto.vnp_SecureHash, _vnpHashSecret);

        //    if (checkSignature)
        //    {
        //        if (dto.vnp_ResponseCode == "00")
        //        {
        //            return (true, "Thanh toán thành công");
        //        }
        //        return (false, "Giao dịch thất bại tại ngân hàng");
        //    }

        //    return (false, "Chữ ký VNPAY không hợp lệ");
        //}
        //public async Task<(bool Success,string Message)> ProcessReturnAsync(VnpayReturnDto dto)
        //{
        //    var vnpay = new VnPayLibrary();
        //    // Thêm tất cả param vào để validate signature
        //    foreach (var prop in typeof(VnpayReturnDto).GetProperties())
        //    {
        //        var value = prop.GetValue(dto)?.ToString();
        //        if (!string.IsNullOrEmpty(value) && prop.Name.StartsWith("vnp_"))
        //            vnpay.AddResponseData(prop.Name, value);
        //    }

        //    bool isValid = vnpay.ValidateSignature(dto.vnp_SecureHash, _vnpHashSecret);

        //    if (!isValid) return (false, "Chữ ký không hợp lệ");

        //    var order = await _context.Orders.FindAsync(long.Parse(dto.vnp_TxnRef));
        //    if (order == null) return (false, "Không tìm thấy đơn hàng");

        //    if (dto.vnp_ResponseCode == "00" && dto.vnp_TransactionStatus == "00")
        //    {
        //        order.TrangThaiDonHang = "Paid";
        //        // Thêm lịch sử trạng thái
        //        order.OrderStatusHistories.Add(new OrderStatusHistory
        //        {
        //            DonHangId = order.Id,
        //            TrangThai = "Paid",
        //            ThoiGianCapNhat = DateTime.Now,
        //            NguoiCapNhat = null // hoặc user hiện tại nếu có
        //        });

        //        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.DonHangId == order.Id);
        //        if (payment != null)
        //        {
        //            payment.TrangThaiThanhToan = "Success";
        //            payment.MaGiaoDich = dto.vnp_TransactionNo;
        //        }
        //    }
        //    else
        //    {
        //        order.TrangThaiDonHang = "Failed";
        //    }

        //    await _context.SaveChangesAsync();
        //    return (true, dto.vnp_ResponseCode == "00" ? "Thanh toán thành công" : "Thanh toán thất bại");
        //}

        // Xử lý IPN (quan trọng nhất - VNPAY gọi ngầm)
        public async Task ProcessIpnAsync(VnpayReturnDto dto)
        {
            // Validate signature tương tự ProcessReturnAsync
            var vnpay = new VnPayLibrary();
            foreach (var prop in typeof(VnpayReturnDto).GetProperties())
            {
                var value = prop.GetValue(dto)?.ToString();
                if (!string.IsNullOrEmpty(value) && prop.Name.StartsWith("vnp_"))
                    vnpay.AddResponseData(prop.Name, value);
            }

            bool isValid = vnpay.ValidateSignature(dto.vnp_SecureHash, _vnpHashSecret);
            if (!isValid) return;

            var order = await _context.Orders.FindAsync(long.Parse(dto.vnp_TxnRef));
            if (order == null || order.TrangThaiDonHang != "Pending") return;

            if (dto.vnp_ResponseCode == "00" && dto.vnp_TransactionStatus == "00")
            {
                order.TrangThaiDonHang = "Paid";

                order.OrderStatusHistories.Add(new OrderStatusHistory
                {
                    DonHangId = order.Id,
                    TrangThai = "Paid",
                    ThoiGianCapNhat = DateTime.Now
                });

                var payment = await _context.Payments.FirstOrDefaultAsync(p => p.DonHangId == order.Id);
                if (payment != null)
                {
                    payment.TrangThaiThanhToan = "Success";
                    payment.MaGiaoDich = dto.vnp_TransactionNo;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
