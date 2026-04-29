import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(res => {
      // Sắp xếp đơn hàng mới nhất lên đầu
      const sortedOrders = res.data.sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
    }).catch(err => console.error("Lỗi khi lấy đơn hàng:", err));
  }, []);

  // Hàm xử lý đống JSON cấu hình thành tiếng Việt dễ đọc
  const renderConfig = (jsonConfig) => {
    try {
      if (!jsonConfig) return <tr><td colSpan="2" className="text-center py-2">Cấu hình tiêu chuẩn</td></tr>;
      
      const config = typeof jsonConfig === 'string' ? JSON.parse(jsonConfig) : jsonConfig;

      const translation = {
        loaiPin: "Loại pin",
        mauNoiThat: "Màu nội thất",
        loaiNoiThat: "Gói nội thất",
        mauNgoaiThat: "Màu ngoại thất",
        mau: "Màu sắc",
        phienBan: "Phiên bản"
      };

      const rows = Object.entries(config)
        .filter(([key]) => key !== 'phienBanId')
        .map(([key, value]) => (
          <tr key={key} className="border-b border-gray-100 last:border-0">
            <td className="py-2 pr-4 font-medium text-gray-500 w-1/3">{translation[key] || key}</td>
            <td className="py-2 text-gray-800 font-semibold">{value}</td>
          </tr>
        ));

      return rows.length > 0 ? rows : <tr><td colSpan="2" className="text-center py-2">Cấu hình tiêu chuẩn</td></tr>;
    } catch (e) {
      return <tr><td colSpan="2" className="py-2 text-red-500">Lỗi định dạng cấu hình</td></tr>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Đơn hàng của tôi</h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Bạn chưa có đơn hàng nào.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all">
              
              {/* Header đơn hàng */}
              <div 
                className={`p-6 cursor-pointer hover:bg-blue-50/30 transition-colors flex justify-between items-center ${expandedOrderId === order.id ? 'bg-blue-50/20' : ''}`}
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xl text-blue-900">#{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.trangThaiDonHang === 'Paid' ? 'bg-blue-100 text-blue-700' : 
                      order.trangThaiDonHang === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.trangThaiDonHang === 'Paid' ? 'Đã đặt cọc' : 
                       order.trangThaiDonHang === 'Confirmed' ? 'Đã xác nhận' : order.trangThaiDonHang}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 font-medium">
                    Ngày đặt: {new Date(order.thoiGianTao).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-black text-blue-600">{order.tongTien.toLocaleString()} ₫</p>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    {expandedOrderId === order.id ? 'Thu gọn ▲' : 'Chi tiết đơn ▼'}
                  </p>
                </div>
              </div>

              {/* Chi tiết đơn hàng khi mở rộng */}
              {expandedOrderId === order.id && (
                <div className="px-6 pb-6 bg-gray-50/50 border-t border-gray-100 pt-6 animate-fadeIn">
                  <h4 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">Sản phẩm đã chọn</h4>
                  
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex-1">
                          <p className="font-extrabold text-gray-800 text-lg uppercase">{item.mauXe || "Dòng xe VinFast"}</p>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                             <span className="text-sm text-gray-600 leading-relaxed italic">
                                {renderConfig(item.cauHinhXe)}
                             </span>
                          </div>
                          
                          <p className="text-sm mt-3 font-bold text-gray-500">
                            Số lượng: <span className="text-gray-800">{item.soLuong}</span>
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-gray-700">{item.gia.toLocaleString()} ₫</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tổng kết tiền cọc */}
                  <div className="mt-6 pt-5 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="text-gray-600 font-bold">Số tiền đặt cọc (20%):</span>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">* Đã bao gồm thuế và phí giữ chỗ</p>
                    </div>
                    <span className="text-2xl font-black text-red-600">{order.soTienDatCoc.toLocaleString()} ₫</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}