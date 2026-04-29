import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'success' | 'failed' | 'processing'>('processing');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const successParam = searchParams.get('success');
    const msgParam = searchParams.get('message');

    setOrderId(orderIdParam);

    if (successParam === 'true') {
      setStatus('success');
      setMessage(msgParam || 'Thanh toán thành công! Cảm ơn quý khách.');
    } else if (successParam === 'false') {
      setStatus('failed');
      setMessage(msgParam || 'Thanh toán thất bại. Vui lòng thử lại.');
    } else {
      // Nếu không có param, có thể gọi API kiểm tra trạng thái đơn hàng
      checkOrderStatus(orderIdParam);
    }

    setLoading(false);
  }, [searchParams]);

  const checkOrderStatus = async (id: string | null) => {
    if (!id) return;
    try {
      const res = await axios.get(`/api/orders/${id}`);
      const order = res.data;

      if (order.trangThaiDonHang === 'Paid') {
        setStatus('success');
        setMessage('Thanh toán thành công!');
      } else {
        setStatus('failed');
        setMessage('Đơn hàng chưa được thanh toán.');
      }
    } catch (error) {
      setStatus('failed');
      setMessage('Không thể kiểm tra trạng thái đơn hàng.');
    }
  };

  const handleBackToHome = () => navigate('/');
  const handleViewOrder = () => navigate(`/orders/${orderId}`);

  if (loading) {
    return <div className="text-center py-20">Đang kiểm tra kết quả thanh toán...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
        {/* Icon */}
        {status === 'success' ? (
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl">✅</span>
          </div>
        ) : (
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-6xl">❌</span>
          </div>
        )}

        <h1 className={`text-3xl font-bold mb-3 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        <p className="text-gray-600 mb-8">{message}</p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Mã đơn hàng: <strong>#{orderId}</strong>
          </p>
        )}

        <div className="space-y-4">
          <button
            onClick={handleBackToHome}
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Về trang chủ
          </button>

          {status === 'success' && (
            <button
              onClick={handleViewOrder}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Xem chi tiết đơn hàng
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Nếu có bất kỳ vấn đề gì, vui lòng liên hệ hotline hỗ trợ
        </p>
      </div>
    </div>
  );
};

export default PaymentResultPage;