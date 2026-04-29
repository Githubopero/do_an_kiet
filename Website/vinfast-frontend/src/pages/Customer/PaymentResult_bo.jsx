import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | failed
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const successParam = searchParams.get('success');
    const msgParam = searchParams.get('message');

    setOrderId(orderIdParam);

    if (successParam === 'true') {
      setStatus('success');
      setMessage(msgParam || 'Thanh toán thành công! Cảm ơn quý khách đã mua xe VinFast.');
    } else {
      setStatus('failed');
      setMessage(msgParam || 'Thanh toán thất bại hoặc bị hủy. Vui lòng thử lại sau.');
    }
  }, [searchParams]);

  const handleBackHome = () => navigate('/');
  const handleViewOrder = () => {
    if (orderId) navigate('/customer/orders');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Đang kiểm tra kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Icon */}
        {status === 'success' ? (
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">✅</span>
          </div>
        ) : (
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">❌</span>
          </div>
        )}

        <h1 className={`text-3xl font-bold mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        <p className="text-gray-600 mb-8 text-lg">{message}</p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Mã đơn hàng: <strong>#{orderId}</strong>
          </p>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleBackHome}
            className="py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition"
          >
            Về Trang Chủ
          </button>

          {status === 'success' && (
            <button
              onClick={handleViewOrder}
              className="py-3.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Xem Đơn Hàng Của Tôi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;