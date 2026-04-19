import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get(`/dealer/orders?status=${status}`)
      .then(res => setOrders(res.data));
  }, [status]);

  const confirmOrder = async (id) => {
    await api.post(`/dealer/orders/${id}/confirm`);
    alert('Đã xác nhận đơn hàng!');
    // Reload danh sách
    window.location.reload();
  };

  const updateStatus = async (id, newStatus) => {
    await api.post(`/dealer/orders/${id}/status`, { newStatus });
    alert('Cập nhật trạng thái thành công!');
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">Tất cả</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="InProduction">InProduction</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-300">
            <tr>
              <th className="p-4 text-left">Mã ĐH</th>
              <th className="p-4 text-left">Khách hàng</th>
              <th className="p-4 text-left">Tổng tiền</th>
              <th className="p-4 text-left">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4 font-semibold">{order.tongTien.toLocaleString()} ₫</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-2">
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => confirmOrder(order.id)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700"
                    >
                      Xác nhận
                    </button>
                  )}
                  <select 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-3 py-1.5 text-sm"
                  >
                    <option value="">Cập nhật trạng thái</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="InProduction">InProduction</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}