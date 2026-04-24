import { useEffect, useState,useRef } from 'react';// 1. Thêm useRef
import { useReactToPrint } from 'react-to-print';     // 2. Import thư viện
import api from '../../services/api';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchOrders();
  }, [status]);

  // 3. Khởi tạo ref để xác định vùng cần in
  const componentRef = useRef();

  // 4. Cấu hình hàm xử lý in
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Hoa-don-DH-${selectedOrder?.id}`,
    onAfterPrint: () => alert('Xuất hóa đơn thành công!'),
  });

  const fetchOrders = () => {
    api.get(`/dealer/orders?status=${status}`).then(res => {
      let data = res.data;
      // Kiểm tra nếu data là mảng mới sort để tránh lỗi
      if (Array.isArray(data)) {
        data.sort((a, b) => sortOrder === 'desc' ? b.id - a.id : a.id - b.id);
        setOrders(data);
      }
    }).catch(err => console.error("Lỗi lấy danh sách đơn hàng:", err));
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    const sorted = [...orders].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    );
    setOrders(sorted);
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển đơn hàng sang trạng thái: ${newStatus}?`)) return;
    try {
      await api.post(`/dealer/orders/${id}/status`, { newStatus });
      alert('Cập nhật thành công!');
      fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data || error.message));
    }
  };

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

  const translateKey = (key) => {
    const map = {
      mauNgoaiThat: "Màu ngoại thất",
      mauNoiThat: "Màu nội thất",
      loaiPin: "Loại Pin",
      loaiNoiThat: "Kiểu nội thất"
    };
    return map[key] || key;
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
            className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
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
          <thead className="bg-blue-900 border-b border-gray-100 text-white">
            <tr>
              <th className="p-4 text-left cursor-pointer hover:bg-blue-800 transition-colors" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase">Khách hàng</th>
              <th className="p-4 text-left text-xs font-bold uppercase">Tiền đặt cọc</th>
              <th className="p-4 text-left text-xs font-bold uppercase">Tổng giá trị</th>
              <th className="p-4 text-left text-xs font-bold uppercase">Trạng thái</th>
              <th className="p-4 text-center text-xs font-bold uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-600">#{order.id}</td>
                <td className="p-4 font-medium text-gray-700">{order.customerName}</td>
                <td className="p-4 text-orange-600 font-bold">{order.soTienDatCoc?.toLocaleString()} ₫</td>
                <td className="p-4 font-bold text-gray-900">{order.tongTien?.toLocaleString()} ₫</td>
                <td className="p-4">{renderStatusBadge(order.status)}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <button 
                    onClick={() => {
                      console.log("Dữ liệu đơn hàng chọn:", order); // Debug xem có items không
                      setSelectedOrder(order);
                    }}
                    className="px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-bold text-sm border border-blue-200"
                  >
                    Xem chi tiết
                  </button>

                  {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                    <select 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                    <span className="text-gray-400 text-xs italic p-2 self-center">Khóa thao tác</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* PHẦN NÀY SẼ ĐƯỢC IN: Thêm ref={componentRef} vào div bao bọc nội dung */}
            <div ref={componentRef} className="p-8"> 
                {/* Header trong bản in */}
                <div className="flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-blue-900 uppercase">Hóa đơn bán hàng</h1>
                        <p className="text-sm text-gray-500">Mã đơn: #{selectedOrder.id}</p>
                        <p className="text-sm text-gray-500">Ngày: {new Date(selectedOrder.thoiGianTao).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-blue-800">VINFAST AUTO</h2>
                        <p className="text-xs text-gray-500">Đại lý ủy quyền chính thức</p>
                    </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400 uppercase text-[10px] font-bold">Khách hàng</p>
                        <p className="font-bold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 uppercase text-[10px] font-bold">Trạng thái</p>
                        <p className="font-bold">{selectedOrder.status}</p>
                    </div>
                </div>

                {/* Danh sách xe (Copy lại logic cũ của bạn) */}
                {selectedOrder.items?.map((item, idx) => (
                   <div key={idx} className="mb-4 border-b border-gray-100 pb-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg">{item.tenXe} - {item.tenPhienBan}</span>
                        <span className="font-bold">{item.giaCuoi?.toLocaleString()} ₫</span>
                      </div>
                      <div className="pl-4 mt-2">
                        {item.chiTietCauHinh?.map((opt, i) => (
                           <div key={i} className="text-xs text-gray-600 flex justify-between">
                              <span>• {opt.nhan}: {opt.giaTri}</span>
                              <span>+{opt.giaChenhLech?.toLocaleString()} ₫</span>
                           </div>
                        ))}
                      </div>
                   </div>
                ))}

                {/* Tổng tiền */}
                <div className="mt-6 text-right">
                    <p className="text-sm text-gray-500">Tổng giá trị đơn hàng</p>
                    <p className="text-2xl font-black text-red-600">{selectedOrder.tongTien?.toLocaleString()} ₫</p>
                    <div className="mt-2 text-xs italic text-gray-400">
                        * Giá trên đã bao gồm VAT và các tùy chọn đi kèm.
                    </div>
                </div>
            </div>

            {/* FOOTER MODAL (Nút bấm - Phần này KHÔNG nằm trong ref nên sẽ KHÔNG bị in ra) */}
            <div className="p-6 bg-white border-t flex justify-end space-x-3">
                <button 
                    onClick={handlePrint} // 5. Gọi hàm in
                    className="px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    In hóa đơn (PDF)
                </button>
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-8 py-3 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all"
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