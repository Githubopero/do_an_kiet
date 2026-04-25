import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const responseCode = searchParams.get('vnp_ResponseCode');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl text-center">
      {responseCode === '00' ? (
        <>
          <div className="text-green-500 text-6xl mb-4">✔</div>
          <h2 className="text-2xl font-bold">Đặt cọc thành công!</h2>
          <p className="text-gray-600 mt-2">VinFast đã tiếp nhận đơn hàng của bạn.</p>
        </>
      ) : (
        <>
          <div className="text-red-500 text-6xl mb-4">✘</div>
          <h2 className="text-2xl font-bold">Thanh toán thất bại</h2>
          <p className="text-gray-600 mt-2">Giao dịch bị hủy hoặc có lỗi xảy ra (Mã lỗi: {responseCode}).</p>
        </>
      )}
      <button 
        onClick={() => navigate('/customer/orders')}
        className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Xem đơn hàng của tôi
      </button>
    </div>
  );
}