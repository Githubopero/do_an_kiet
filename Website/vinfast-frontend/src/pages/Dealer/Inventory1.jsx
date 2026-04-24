import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu
  const fetchInventory = async () => {
    try {
      const res = await api.get('/dealer/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu kho:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateQuantity = async (id, change) => {
    try {
      await api.put(`/dealer/inventory/${id}`, { change });
      // Thay vì load lại trang, ta cập nhật lại dữ liệu ngay tại chỗ
      fetchInventory(); 
    } catch (err) {
      alert('Không thể cập nhật số lượng!');
    }
  };


  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu kho...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản lý Kho hàng Đại lý</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-orange-300">
            <tr>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-center">Tồn kho</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              return (
                <tr key={item.id} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="p-4 font-bold text-blue-900">{item.mauXe}</td>
                
                  <td className="p-4 text-center">
                    <span className={`inline-block w-12 py-1 rounded-full font-bold ${item.soLuongTonKho < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {item.soLuongTonKho}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex items-center bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 shadow-sm transition-all"
                      >
                        <span className="mr-1 text-lg font-bold"></span> Nhập kho
                      </button>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex items-center bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 shadow-sm transition-all"
                      >
                        <span className="mr-1 text-lg font-bold"></span> Xuất kho
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {inventory.length === 0 && (
          <div className="p-10 text-center text-gray-500 italic">
            Hiện không có xe nào trong kho hàng.
          </div>
        )}
      </div>
    </div>
  );
}