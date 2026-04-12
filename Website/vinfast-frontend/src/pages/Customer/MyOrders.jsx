import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Mã đơn: #{order.id}</p>
                <p className="text-2xl font-bold mt-1">{order.tongTien.toLocaleString()} ₫</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${order.trangThaiDonHang === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.trangThaiDonHang}
              </div>
            </div>
            <p className="text-gray-600 mt-4">Đặt ngày: {new Date(order.thoiGianTao).toLocaleDateString('vi-VN')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}