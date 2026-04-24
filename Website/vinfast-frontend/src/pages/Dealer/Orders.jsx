import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // Để xem chi tiết

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = () => {
    api.get(`/dealer/orders?status=${status}`).then(res => setOrders(res.data));
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển đơn hàng sang trạng thái: ${newStatus}?`)) return;
    try {
      await api.post(`/dealer/orders/${id}/status`, { newStatus });
      alert('Cập nhật thành công!');
      fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + error.response?.data || error.message);
    }
  };
  // Hàm helper để render Badge trạng thái cho đẹp và chuyên nghiệp hơn
  const renderStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-700",
      Confirmed: "bg-blue-100 text-blue-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      Pending: "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Delivered: "Đã bàn giao",
      Cancelled: "Đã hủy",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Quản lý Đơn hàng Đại lý</h1>
        <div className="flex items-center space-x-2">
           <span className="text-sm text-gray-500">Lọc trạng thái:</span>
           <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
            <option value="">Tất cả đơn hàng</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Delivered">Đã bàn giao</option>
            <option value="Cancelled">Đã hủy</option>
            </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Mã ĐH</th>
              <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Khách hàng</th>
              <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Tiền cọc</th>
              <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Tổng tiền</th>
              <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Trạng thái</th>
              <th className="p-4 text-center text-xs font-bold text-gray-400 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-600">#{order.id}</td>
                <td className="p-4 font-medium">{order.customerName}</td>
                <td className="p-4 text-orange-600 font-bold">{order.soTienDatCoc?.toLocaleString()} ₫</td>
                <td className="p-4 font-bold">{order.tongTien.toLocaleString()} ₫</td>
                <td className="p-4">{renderStatusBadge(order.status)}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    🔍
                  </button>

                  {/* Logic khóa select nếu đơn đã hoàn tất hoặc đã hủy */}
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                    <select 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      value=""
                    >
                      <option value="" disabled>Chuyển đến...</option>
                      {order.status === 'Pending' && (
                        <>
                          <option value="Confirmed">Xác nhận đơn (Tạm giữ xe)</option>
                          <option value="Cancelled">Hủy đơn</option>
                        </>
                      )}
                      {order.status === 'Confirmed' && (
                        <>
                          <option value="Delivered">Đã bàn giao (Trừ kho)</option>
                          <option value="Cancelled">Hủy đơn (Giải phóng xe)</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <span className="text-gray-400 text-xs italic p-2">Không thể sửa</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-blue-900 text-white">
                <div>
                  <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
                  <p className="text-blue-200 text-xs">{new Date(selectedOrder.thoiGianTao).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-2xl hover:text-red-400">&times;</button>
            </div>
            
            <div className="p-6">
                <div className="bg-blue-50 p-4 rounded-2xl mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500 text-xs uppercase">Khách hàng</p>
                        <p className="font-bold text-gray-800">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase">Trạng thái hiện tại</p>
                        {renderStatusBadge(selectedOrder.status)}
                    </div>
                </div>

                <h3 className="font-bold mb-3 text-gray-700">Danh sách sản phẩm:</h3>
                <div className="border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3 text-left">Mẫu xe & Phiên bản</th>
                                <th className="p-3 text-center">SL</th>
                                <th className="p-3 text-right">Đơn giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-3">
                                        <p className="font-bold text-blue-900">{item.tenXe}</p>
                                        <p className="text-[11px] text-gray-500 leading-tight">{item.cauHinhXe}</p>
                                    </td>
                                    <td className="p-3 text-center font-medium">{item.soLuong}</td>
                                    <td className="p-3 text-right font-bold text-blue-600">{item.gia.toLocaleString()} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                            <tr>
                                <td colSpan="2" className="p-3 text-right">Tổng thanh toán:</td>
                                <td className="p-3 text-right text-lg text-red-600">{selectedOrder.tongTien.toLocaleString()} ₫</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Note cho nhân viên về logic kho */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start space-x-2">
                    <span className="text-amber-600">⚠️</span>
                    <p className="text-[11px] text-amber-800">
                      <b>Lưu ý cho nhân viên:</b> Việc chuyển sang <b>Đã xác nhận</b> sẽ tăng số lượng tạm giữ trong kho. 
                      Chỉ chuyển sang <b>Đã bàn giao</b> khi xe thực tế đã rời khỏi đại lý.
                    </p>
                </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-8 py-2.5 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-all text-gray-700"
                >
                    Đóng
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}