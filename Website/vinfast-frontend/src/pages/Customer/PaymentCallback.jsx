import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các thông số quan trọng từ URL do VNPAY trả về
  const responseCode = searchParams.get('vnp_ResponseCode');
  const orderId = searchParams.get('vnp_TxnRef'); // Đây là ID đơn hàng bạn gửi đi
  const amount = searchParams.get('vnp_Amount'); // Số tiền (đã nhân 100)
  const transactionNo = searchParams.get('vnp_TransactionNo'); // Mã giao dịch VNPAY

  useEffect(() => {
    if (responseCode === '00') {
      // Nếu thanh toán thành công, bạn có thể thực hiện xóa giỏ hàng local (nếu có)
      // Hoặc bắn một thông báo tới hệ thống
      console.log(`Đơn hàng ${orderId} đã thanh toán thành công.`);
    }
  }, [responseCode, orderId]);

  return (
    <div className="max-w-xl mx-auto mt-16 p-10 bg-white shadow-2xl rounded-3xl text-center border border-gray-100">
      {responseCode === '00' ? (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl">
              ✔
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Xác nhận đặt cọc thành công!</h2>
          <p className="text-gray-500 mb-8">Chúc mừng bạn đã tiến gần hơn tới việc sở hữu chiếc xe VinFast mơ ước.</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3 mb-8">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Mã đơn hàng:</span>
              <span className="font-semibold">#VNF{orderId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Số tiền đặt cọc:</span>
              <span className="font-semibold text-blue-600">
                {(parseInt(amount) / 100).toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mã giao dịch:</span>
              <span className="font-mono text-sm">{transactionNo}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl">
              ✘
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Thanh toán chưa hoàn tất</h2>
          <p className="text-gray-500 mb-8">Rất tiếc, giao dịch đã bị hủy hoặc gặp lỗi kỹ thuật trong quá trình xử lý.</p>
          
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-orange-700 text-sm mb-8">
            Mã lỗi: {responseCode} - Bạn có thể thử thanh toán lại trong phần lịch sử đơn hàng.
          </div>
        </>
      )}

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => navigate('/customer/orders')}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200"
        >
          Xem lịch sử đơn hàng
        </button>
        <button 
          onClick={() => navigate('/customer')}
          className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl transition-all"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}