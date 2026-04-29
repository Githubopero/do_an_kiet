import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
// 1. Import instance api của bạn (thay đổi đường dẫn cho đúng)
import api from '../../services/api';

interface OrderItem {
  id: number;
  tenPhienBan: string;
  gia: number;
  soLuong: number;
}
// THÊM: Danh sách các ngân hàng hỗ trợ trong môi trường Sandbox VNPAY
const SUPPORTED_BANKS = [
  { code: "", name: "Cổng thanh toán VNPAY", desc: "Chọn ngân hàng tại giao diện VNPAY" },
    { code: "VNBANK", name: "Thanh toán qua ATM/Tài khoản nội địa", desc: "Sử dụng thẻ ATM ngân hàng Việt Nam" },
    { code: "VNPAYQR", name: "Thanh toán quét mã QR", desc: "Sử dụng ứng dụng Mobile Banking" },
    { code: "INTCARD", name: "Thẻ quốc tế", desc: "Visa, MasterCard, JCB" },
];

// THÊM: Danh sách ngân hàng cụ thể để người dùng chọn trực tiếp (Bỏ qua bước trung gian tại VNPAY)
const LOCAL_BANKS = [
    { code: "NCB", name: "Ngân hàng NCB (Khuyên dùng để test)", logo: "https://vnpay.vn/wp-content/uploads/2020/07/logo-ncb.png" },
    { code: "VIETCOMBANK", name: "Vietcombank", logo: "" },
    { code: "TECHCOMBANK", name: "Techcombank", logo: "" },
    { code: "BIDV", name: "BIDV", logo: "" },
];
const CheckoutPage: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // SỬA: Mặc định chọn NCB để dễ dàng test trong môi trường Sandbox
    const [selectedBank, setSelectedBank] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId'); // Lấy từ URL: ?orderId=xxx


  // Giả sử bạn đã có orderId từ state hoặc URL params
  // const orderId = 123; // Thay bằng cách lấy từ context hoặc URL

 useEffect(() => {
  const fetchOrder = async () => {
    // Bước 1: Kiểm tra xem trên URL có orderId không
    if (!orderId) {
      alert("Không tìm thấy mã đơn hàng. Vui lòng quay lại giỏ hàng.");
      navigate('/customer/cart'); // Điều hướng người dùng về giỏ hàng nếu không có ID
      return;
    }

    // Bước 2: Nếu có orderId, tiến hành gọi API
    try {
      setLoading(true); // Đảm bảo trạng thái loading được bật
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      alert("Không tìm thấy dữ liệu đơn hàng trên hệ thống.");
      navigate('/customer/cart');
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [orderId, navigate]); // Thêm navigate vào mảng phụ thuộc để tránh cảnh báo lint

  const handleVnpayPayment = async () => {
    if (!order) return;

    setProcessing(true);
    try {
      // SỬA: Đổi từ axios.post sang api.post để có Token
            // Lưu ý: Endpoint này bạn cần viết ở Backend để gọi sang VNPAY
      const response = await api.post('/payment/create', {
        orderId: order.id,
        bankCode: selectedBank,
        locale: "vn"
      });

      if (response.data.paymentUrl) {
        // Chuyển hướng sang VNPAY
        // CHÚ Ý: VNPAY sẽ dựa vào bankCode bạn gửi lên để hiện trang nhập thẻ tương ứng
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Không nhận được link thanh toán từ VNPAY");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải thông tin đơn hàng...</div>;
  if (!order) return <div className="text-center py-10">Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Thanh toán đơn hàng #{order.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG */}
                <div className="md:col-span-1">
                    <div className="bg-white shadow-md rounded-xl p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tóm tắt đơn hàng</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Số tiền đặt cọc (20%)</p>
                                <p className="text-2xl font-bold text-red-600">{order.soTienDatCoc?.toLocaleString()} ₫</p>
                            </div>
                            <div className="text-sm space-y-2 text-gray-700">
                                <p><strong>Tổng giá trị xe:</strong> {order.tongTien?.toLocaleString()} ₫</p>
                                <p><strong>Trạng thái:</strong> <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">{order.trangThaiDonHang}</span></p>
                                <p><strong>Ngày tạo:</strong> {new Date(order.thoiGianTao).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium text-sm mb-3 text-gray-500 uppercase tracking-wider">Sản phẩm</h3>
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="text-sm border-t py-2">
                                    <p className="font-semibold text-gray-800">{item.mauXe}</p>
                                    <p className="text-gray-500 italic">Số lượng: {item.soLuong}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-6">Chọn phương thức thanh toán</h2>
                        
                        <div className="space-y-6">
                            {/* Khối 1: Các cổng thanh toán chính */}
                            <div className="grid grid-cols-1 gap-3">
                                {SUPPORTED_BANKS.map((method) => (
                                    <label key={method.code} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedBank === method.code ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            name="bankGroup"
                                            value={method.code}
                                            checked={selectedBank === method.code}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-800">{method.name}</p>
                                            <p className="text-xs text-gray-500">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* THÊM: Khối chọn nhanh ngân hàng nội địa (Giống demo VNPAY) */}
                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium text-gray-600 mb-4 font-italic italic">Hoặc chọn nhanh ngân hàng nội địa để thanh toán ngay:</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {LOCAL_BANKS.map((bank) => (
                                        <button
                                            key={bank.code}
                                            type="button"
                                            onClick={() => setSelectedBank(bank.code)}
                                            className={`p-3 border-2 rounded-lg text-sm font-semibold transition-all ${selectedBank === bank.code ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'bg-gray-50 hover:bg-white text-gray-700 border-gray-200'}`}
                                        >
                                            {bank.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleVnpayPayment}
                            disabled={processing}
                            className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Đang kết nối cổng VNPAY...
                                </span>
                            ) : "XÁC NHẬN THANH TOÁN"}
                        </button>

                        <div className="mt-6 flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <img src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" alt="VNPAY" className="h-6" />
                            <span className="text-xs text-gray-400">| Bảo mật thanh toán bởi VNPAY</span>
                        </div>
                    </div>
                </div>
            </div>
      {/* Thông tin đơn hàng */}
      {/* <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="space-y-3">
          <p><strong>Tổng tiền:</strong> {order.tongTien.toLocaleString()} ₫</p>
          <p><strong>Trạng thái:</strong> {order.trangThaiDonHang}</p>
          <p><strong>Ngày tạo:</strong> {new Date(order.thoiGianTao).toLocaleString()}</p>
        </div> */}

        {/* Danh sách xe */}
        {/* <div className="mt-6">
          <h3 className="font-medium mb-3">Các xe trong đơn hàng:</h3>
          {order.orderItems?.map((item: any) => (
            <div key={item.id} className="border-b py-3">
              <p className="font-medium">{item.phienBan?.tenPhienBan || 'Phiên bản xe'}</p>
              <p className="text-sm text-gray-600">
                Số lượng: {item.soLuong} × {item.gia.toLocaleString()} ₫
              </p>
            </div>
          ))}
        </div> */}
      {/* </div> */}

      {/* Chọn phương thức thanh toán */}
      {/* <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Chọn phương thức thanh toán</h2>
        
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="bankCode"
              value="VNBANK"
              checked={selectedBank === "VNBANK"}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">ATM / Tài khoản ngân hàng nội địa</div>
              <div className="text-sm text-gray-500">Hỗ trợ hầu hết các ngân hàng Việt Nam</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="bankCode"
              value="VNPAYQR"
              checked={selectedBank === "VNPAYQR"}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Thanh toán bằng VNPAY QR</div>
              <div className="text-sm text-gray-500">Quét mã QR bằng app ngân hàng</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="bankCode"
              value="INTCARD"
              checked={selectedBank === "INTCARD"}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Thẻ quốc tế (Visa, MasterCard...)</div>
            </div>
          </label>
        </div> */}

        {/* <button
          onClick={handleVnpayPayment}
          disabled={processing}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {processing ? "Đang xử lý..." : "Thanh toán bằng VNPAY"}
        </button> */}

        {/* <p className="text-center text-sm text-gray-500 mt-4">
          Bạn sẽ được chuyển hướng đến cổng thanh toán VNPAY
        </p> */}
      {/* </div> */}
    </div>
  );
};

export default CheckoutPage;