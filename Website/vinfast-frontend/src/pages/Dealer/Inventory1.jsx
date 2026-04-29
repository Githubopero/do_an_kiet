import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' hoặc 'desc'

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dealer/inventory');
      let data = res.data;

      // Logic sắp xếp theo ID
      data.sort((a, b) => {
        return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
      });

      setInventory(data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu kho:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [sortOrder]); // Re-run khi đổi chiều sắp xếp
  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  const updateQuantity = async (id, change) => {
    try {
      // Gọi endpoint put đã sửa ở Controller: api/dealer/inventory/{id}
      await api.put(`/dealer/inventory/${id}`, { change });
      fetchInventory(); 
    } catch (err) {
      alert('Không thể cập nhật số lượng! Vui lòng kiểm tra lại.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black tracking-tight">Quản lý kho hàng</h1>
            <p className="text-gray-500 text-sm">Theo dõi tồn kho vật lý và số lượng xe khách đã đặt cọc</p>
        </div>
        
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-300 text-black">
              <th className="p-4 text-left cursor-pointer hover:bg-orange-400" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4">Mẫu xe và phiên bản</th>
              <th className="p-4">Tồn vật lý</th>
              <th className="p-4">Tạm giữ chỗ(Cọc)</th>
              <th className="p-4">Khả dụng</th>
              <th className="p-4">Thao tác kho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map(item => {
              const khaDung = item.soLuongTonKho - item.soLuongTamGiu;
              
              return (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-5 font-mono text-gray-400 font-bold">#{item.id}</td>
                  <td className="p-5">
                    <div className="font-black text-blue-900 text-lg uppercase">{item.tenXe}</div>
                    <div className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                       {item.tenPhienBan}
                    </div>
                  </td>
                
                  <td className="p-5 text-center font-bold text-gray-700 text-lg">
                    {item.soLuongTonKho}
                  </td>

                  <td className="p-5 text-center">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-bold text-sm border border-orange-200">
                      {item.soLuongTamGiu}
                    </span>
                  </td>

                  <td className="p-5 text-center">
                    <div className={`inline-flex flex-col items-center justify-center min-w-[60px] py-2 rounded-2xl font-black shadow-sm border
                        ${khaDung <= 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      <span className="text-xl">{khaDung}</span>
                      <span className="text-[8px] uppercase tracking-tighter">Có thể bán</span>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="group flex items-center bg-white border-2 border-emerald-500 text-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        title="Nhập thêm xe vào kho"
                      >
                        <span className="font-bold text-sm uppercase">Nhập kho</span>
                      </button>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="group flex items-center bg-white border-2 border-rose-500 text-rose-500 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        disabled={item.soLuongTonKho <= 0}
                        title="Xuất xe khỏi kho"
                      >
                        <span className="font-bold text-sm uppercase">Xuất kho</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {inventory.length === 0 && (
          <div className="p-20 text-center">
            <div className="text-gray-300 mb-4 flex justify-center">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-gray-400 italic font-medium">Hiện không có xe nào trong danh mục quản lý kho.</p>
          </div>
        )}
      </div>
    </div>
  );
}