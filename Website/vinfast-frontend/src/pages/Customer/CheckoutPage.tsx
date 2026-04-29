import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

// Danh sách các cổng thanh toán chính của VNPAY
const SUPPORTED_METHODS = [
  { code: "", name: "Cổng thanh toán VNPAY (Tất cả ngân hàng)", desc: "Hệ thống sẽ hiển thị danh sách ngân hàng để bạn chọn" },
  { code: "VNBANK", name: "Thẻ ATM / Tài khoản nội địa", desc: "Sử dụng thẻ ATM các ngân hàng Việt Nam" },
  { code: "VNPAYQR", name: "Thanh toán quét mã QR", desc: "Sử dụng ứng dụng Mobile Banking để quét mã" },
  { code: "INTCARD", name: "Thẻ quốc tế", desc: "Visa, MasterCard, JCB" },
];

const CheckoutPage: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState<string>(""); // Mặc định để trống để hiện tất cả
  const [processing, setProcessing] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        alert("Không tìm thấy mã đơn hàng.");
        navigate('/customer/cart');
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
        alert("Không tìm thấy dữ liệu đơn hàng.");
        navigate('/customer/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handleVnpayPayment = async () => {
    if (!order) return;

    setProcessing(true);
    try {
      const response = await api.post('/payment/create', {
        orderId: order.id,
        bankCode: selectedBank,
        locale: "vn"
      });

      if (response.data.paymentUrl) {
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

  if (loading) return <div className="text-center py-10 italic">Đang tải thông tin đơn hàng...</div>;
  if (!order) return <div className="text-center py-10 text-red-500">Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-center uppercase tracking-tight">Thanh toán đơn hàng #{order.id}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: TÓM TẮT ĐƠN HÀNG */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Thông tin thanh toán</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Số tiền cần thanh toán</p>
                <p className="text-2xl font-extrabold text-blue-700">{order.soTienDatCoc?.toLocaleString()} ₫</p>
                <p className="text-xs text-gray-400 italic mt-1">(Tương ứng 20% giá trị đơn hàng)</p>
              </div>
              <div className="pt-2 text-sm border-t border-dashed border-gray-300">
                <p className="flex justify-between"><span>Tổng giá trị:</span> <strong>{order.tongTien?.toLocaleString()} ₫</strong></p>
                <p className="flex justify-between mt-1"><span>Trạng thái:</span> <span className="text-yellow-600">{order.trangThaiDonHang}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: PHƯƠNG THỨC THANH TOÁN */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Chọn phương thức thanh toán
            </h2>
            
            <div className="space-y-4">
              {SUPPORTED_METHODS.map((method) => (
                <label 
                  key={method.code} 
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedBank === method.code 
                    ? 'border-blue-600 bg-blue-50 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bankGroup"
                    value={method.code}
                    checked={selectedBank === method.code}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-800 leading-tight">{method.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleVnpayPayment}
              disabled={processing}
              className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center"
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ĐANG KẾT NỐI VNPAY...
                </>
              ) : "TIẾN HÀNH THANH TOÁN"}
            </button>

            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-center space-x-2 opacity-60">
                <img src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" alt="VNPAY" className="h-5" />
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">| PCI DSS Compliant</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Bằng việc nhấn thanh toán, bạn đồng ý với các điều khoản dịch vụ của VNPAY</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutPage;