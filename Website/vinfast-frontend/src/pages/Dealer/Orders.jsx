import { useEffect, useState,useRef } from 'react';// 1. Thêm useRef
import { PrintableInvoice } from './PrintableInvoice';
import { useReactToPrint } from 'react-to-print';     // 2. Import thư viện
import api from '../../services/api';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const invoiceRef = useRef(); // Tạo ref cho hóa đơn

  useEffect(() => {
    fetchOrders();
  }, [status]);

  

  // 2. Cập nhật hàm handlePrint theo chuẩn mới của react-to-print
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // Sử dụng contentRef thay vì content
    documentTitle: `HoaDon_VinFast_${selectedOrder?.id || 'Export'}`,
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
        <h1 className="text-2xl font-bold">Quản lý đơn hàng đại lý</h1>
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
          <thead className="bg-orange-300 border-b border-gray-100 text-black">
            <tr>
              <th className="p-4 text-left cursor-pointer hover:bg-orange-400 transition-colors" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Tiền đặt cọc</th>
              <th className="p-4">Tổng giá trị</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
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
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-orange-300 to-orange-400 text-black">
                <div>
                  <h2 className="text-xl font-bold">Đơn hàng #{selectedOrder.id}</h2>
                  <p className="text-xs text-black">Ngày tạo: {selectedOrder.thoiGianTao ? new Date(selectedOrder.thoiGianTao).toLocaleString('vi-VN') : '---'}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-3xl leading-none hover:text-red-400">&times;</button>
            </div>
            
            <div className="p-6 max-h-[65vh] overflow-y-auto bg-gray-50/50">
                {/* Thông tin chung */}
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-3">
                    <p className="flex justify-between text-sm">
                      <span className="text-gray-500">Khách hàng:</span> 
                      <b className="text-gray-800">{selectedOrder.customerName}</b>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="text-gray-500">Trạng thái:</span> 
                      {renderStatusBadge(selectedOrder.status)}
                    </p>
                    <p className="flex justify-between text-orange-600 text-sm border-t pt-2">
                      <span>Số tiền đã cọc:</span> 
                      <b className="text-lg">{selectedOrder.soTienDatCoc?.toLocaleString()} ₫</b>
                    </p>
                </div>

                {/* Danh sách xe trong đơn - Đã thêm kiểm tra an toàn ?.map */}
                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="mb-6 bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-black text-xl text-blue-900 uppercase">{item.tenXe || "N/A"}</h3>
                          <span className="inline-block bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase mt-1">
                            Phiên bản: {item.tenPhienBan || "Tiêu chuẩn"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Giá niêm yết</p>
                          <p className="font-bold text-gray-800">{item.giaPhienBan?.toLocaleString() || 0} ₫</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-gray-50 pt-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Thông số cấu hình:</p>
                        {item.chiTietCauHinh?.length > 0 ? (
                          item.chiTietCauHinh.map((opt, i) => (
                            <div key={i} className="flex justify-between text-sm py-1 bg-gray-50/50 px-2 rounded-lg mb-1">
                              <span className="text-gray-600">{translateKey(opt.nhan)}: <b className="text-gray-800">{opt.giaTri}</b></span>
                              <span className="text-blue-600 font-medium">+{opt.giaChenhLech?.toLocaleString()} ₫</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs italic text-gray-400 ml-2">Sử dụng cấu hình mặc định</p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-blue-50 flex justify-between items-center">
                        <span className="text-sm text-black font-medium italic">Thành tiền (Số lượng: {item.soLuong})</span>
                        <span className="text-xl font-black text-blue-800">{item.giaCuoi?.toLocaleString()} ₫</span>
                      </div>
                      
                      <p className="text-[9px] text-black mt-2 text-right italic font-mono">CODE: VER-{item.phienBanId}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 italic">Không tìm thấy dữ liệu xe chi tiết cho đơn hàng này.</p>
                  </div>
                )}
            </div>

            {/* <div className="p-6 bg-white border-t flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tổng thanh toán</p>
                  <p className="text-3xl font-black text-red-600 tracking-tight">{selectedOrder.tongTien?.toLocaleString()} ₫</p>
                </div>
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-10 py-3 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
                >
                    Đóng
                </button>
            </div> */}
            {/* SỬA PHẦN NÚT BẤM (FOOTER) CỦA MODAL */}
            <div className="p-6 bg-white border-t flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Tổng thanh toán</p>
                  <p className="text-3xl font-black text-red-600 tracking-tight">{selectedOrder.tongTien?.toLocaleString()} ₫</p>
                </div>
                
                <div className="flex space-x-2">
                    {/* Thêm nút In hóa đơn */}
                    <button 
                        onClick={handlePrint}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center shadow-lg shadow-green-100"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        In hóa đơn
                    </button>

                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-8 py-3 bg-orange-300 text-black rounded-2xl font-bold hover:bg-orange-400 transition-all shadow-lg shadow-blue-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN QUAN TRỌNG: Đặt Component in ở ngoài cùng, để chế độ ẩn */}
      <div style={{ display: "none" }}>
        <PrintableInvoice ref={invoiceRef} order={selectedOrder} />
      </div>


    </div>
  );
}