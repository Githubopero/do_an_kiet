import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dealer/inventory');
      let data = res.data;

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
  }, [sortOrder]);

  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  const updateQuantity = async (id, change) => {
    try {
      await api.put(`/dealer/inventory/${id}`, { change });
      fetchInventory(); 
    } catch (err) {
      alert('Không thể cập nhật số lượng! Vui lòng kiểm tra lại.');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
        <p className="mt-4 text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải kho hàng...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Quản lý kho hàng</h1>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sắp xếp:</span>
          <button 
            onClick={toggleSort}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            ID {sortOrder === 'desc' ? 'Mới nhất ▼' : 'Cũ nhất ▲'}
          </button>
        </div>
      </div>
      
      {/* Table Container - Mobile friendly overflow */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-orange-300 text-black">
                <th className="p-5 text-left font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-orange-400 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '▼' : '▲'}
                </th>
                <th className="p-5 text-left font-black uppercase tracking-widest text-xs">Mẫu xe và phiên bản</th>
                <th className="p-5 text-center font-black uppercase tracking-widest text-xs">Tồn vật lý</th>
                <th className="p-5 text-center font-black uppercase tracking-widest text-xs">Tạm giữ chỗ</th>
                <th className="p-5 text-center font-black uppercase tracking-widest text-xs text-blue-900">Khả dụng</th>
                <th className="p-5 text-center font-black uppercase tracking-widest text-xs">Thao tác kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map(item => {
                const khaDung = item.soLuongTonKho - item.soLuongTamGiu;
                
                return (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="p-5 font-mono text-gray-400 font-bold text-sm">#{item.id}</td>
                    <td className="p-5">
                      <div className="font-black text-blue-900 text-lg uppercase tracking-tight">{item.tenXe}</div>
                      <div className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase">
                         {item.tenPhienBan}
                      </div>
                    </td>
                  
                    <td className="p-5 text-center">
                      <span className="font-black text-gray-700 text-xl">{item.soLuongTonKho}</span>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Sản phẩm</p>
                    </td>

                    <td className="p-5 text-center">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full font-black text-sm border border-orange-200">
                        {item.soLuongTamGiu}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      <div className={`inline-flex flex-col items-center justify-center min-w-[70px] py-2 rounded-2xl font-black shadow-sm border transition-transform group-hover:scale-110
                        ${khaDung <= 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        <span className="text-2xl">{khaDung}</span>
                        <span className="text-[8px] uppercase tracking-tighter">Có thể bán</span>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-500 px-4 py-2 rounded-xl font-black text-[11px] uppercase hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-50 active:scale-95"
                          title="Nhập thêm xe vào kho"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                          Nhập kho
                        </button>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="flex items-center gap-2 bg-white border-2 border-rose-500 text-rose-500 px-4 py-2 rounded-xl font-black text-[11px] uppercase hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-rose-500 active:scale-95"
                          disabled={item.soLuongTonKho <= 0}
                          title="Xuất xe khỏi kho"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                          Xuất kho
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {inventory.length === 0 && (
          <div className="p-24 text-center">
            <div className="text-gray-200 mb-6 flex justify-center">
                <svg className="w-24 h-24 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-gray-400 italic font-bold text-lg tracking-tight uppercase">Kho hàng hiện tại đang trống!</p>
          </div>
        )}
      </div>
    </div>
  );
}