import { useEffect, useState, useRef } from 'react';
import { PrintableInvoice } from './PrintableInvoice';
import { useReactToPrint } from 'react-to-print';
import api from '../../services/api';

export default function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const invoiceRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `HoaDon_VinFast_${selectedOrder?.id || 'Export'}`,
  });

  const fetchOrders = () => {
    api.get(`/dealer/orders?status=${status}`).then(res => {
      let data = res.data;
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
      <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap ${styles[status] || 'bg-gray-100'}`}>
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
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Quản lý đơn hàng</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-black uppercase text-gray-400 ml-2">Bộ lọc:</span>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="flex-1 sm:w-48 bg-transparent text-sm font-bold focus:outline-none cursor-pointer text-blue-600"
          >
            <option value="">Tất cả đơn hàng</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Delivered">Đã bàn giao</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* TABLE SECTION - Thêm overflow-x-auto để mobile có thể vuốt ngang */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-orange-300 text-black">
              <tr>
                <th className="p-4 text-left cursor-pointer hover:bg-orange-400 transition-colors uppercase tracking-widest text-xs font-black" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '▼' : '▲'}
                </th>
                <th className="p-4 text-left font-black uppercase tracking-widest text-xs">Khách hàng</th>
                <th className="p-4 text-left font-black uppercase tracking-widest text-xs">Đặt cọc</th>
                <th className="p-4 text-left font-black uppercase tracking-widest text-xs">Tổng giá trị</th>
                <th className="p-4 text-center font-black uppercase tracking-widest text-xs">Trạng thái</th>
                <th className="p-4 text-center font-black uppercase tracking-widest text-xs">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">#{order.id}</td>
                  <td className="p-4 font-medium text-gray-700">{order.customerName}</td>
                  <td className="p-4 text-orange-600 font-black">{order.soTienDatCoc?.toLocaleString()} ₫</td>
                  <td className="p-4 font-black text-gray-900">{order.tongTien?.toLocaleString()} ₫</td>
                  <td className="p-4 text-center">{renderStatusBadge(order.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition-all font-bold text-[11px] uppercase border border-blue-200"
                      >
                        Chi tiết
                      </button>

                      {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                        <select 
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
                          value=""
                        >
                          <option value="" disabled>Cập nhật...</option>
                          {order.status === 'Pending' && (
                            <>
                              <option value="Confirmed">Xác nhận đơn</option>
                              <option value="Cancelled">Hủy đơn</option>
                            </>
                          )}
                          {order.status === 'Confirmed' && (
                            <>
                              <option value="Delivered">Đã bàn giao</option>
                              <option value="Cancelled">Hủy đơn</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span className="text-gray-300 text-[10px] italic font-medium uppercase">Đã đóng</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-orange-300 text-black">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Đơn hàng #{selectedOrder.id}</h2>
                  <p className="text-[10px] font-bold opacity-70 italic">
                    Ngày tạo: {selectedOrder.thoiGianTao ? new Date(selectedOrder.thoiGianTao).toLocaleString('vi-VN') : '---'}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-orange-400 rounded-full transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto bg-gray-50/50 space-y-4">
                {/* Thông tin khách hàng */}
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</p>
                      <p className="font-bold text-gray-800">{selectedOrder.customerName}</p>
                    </div>
                    <div className="space-y-1 sm:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái hiện tại</p>
                      {renderStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="sm:col-span-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Số tiền đã đặt cọc:</span>
                      <span className="text-lg font-black text-orange-600">{selectedOrder.soTienDatCoc?.toLocaleString()} ₫</span>
                    </div>
                </div>

                {/* Danh sách xe chi tiết */}
                {selectedOrder.items?.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-lg text-blue-900 uppercase leading-tight">{item.tenXe || "N/A"}</h3>
                          <span className="inline-block bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase mt-1 tracking-tighter">
                            {item.tenPhienBan || "Tiêu chuẩn"}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 uppercase font-black">Giá niêm yết</p>
                          <p className="font-bold text-gray-700">{item.giaPhienBan?.toLocaleString() || 0} ₫</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-gray-50/80 p-3 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Cấu hình lựa chọn:</p>
                        {item.chiTietCauHinh?.length > 0 ? (
                          item.chiTietCauHinh.map((opt, i) => (
                            <div key={i} className="flex justify-between text-[13px]">
                              <span className="text-gray-600 font-medium">{translateKey(opt.nhan)}: <b className="text-gray-800">{opt.giaTri}</b></span>
                              <span className="text-blue-600 font-bold">+{opt.giaChenhLech?.toLocaleString()} ₫</span>
                            </div>
                          ))
                        ) : <p className="text-xs italic text-gray-400">Cấu hình mặc định</p>}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                        <span className="text-xs text-gray-400 font-bold italic tracking-tighter">Số lượng: {item.soLuong}</span>
                        <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-black uppercase">Thành tiền mặt hàng</p>
                            <p className="text-lg font-black text-blue-800 tracking-tighter">{item.giaCuoi?.toLocaleString()} ₫</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 italic">
                    Không có dữ liệu xe chi tiết.
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Tổng giá trị đơn hàng</p>
                  <p className="text-3xl font-black text-red-600 tracking-tighter">{selectedOrder.tongTien?.toLocaleString()} ₫</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center shadow-lg shadow-green-100 text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        In hóa đơn
                    </button>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex-1 sm:flex-none px-8 py-3 bg-orange-300 text-black rounded-xl font-bold hover:bg-orange-400 transition-all text-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PRINT COMPONENT */}
      <div style={{ display: "none" }}>
        <PrintableInvoice ref={invoiceRef} order={selectedOrder} />
      </div>
    </div>
  );
}