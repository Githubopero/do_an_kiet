import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    api.get('/dealer/inventory').then(res => setInventory(res.data));
  }, []);

  const updateQuantity = async (id, change) => {
    await api.put(`/dealer/inventory/${id}`, { change });
    alert('Cập nhật số lượng thành công!');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Kho hàng Đại lý</h1>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-left">Cấu hình</th>
              <th className="p-4 text-center">Tồn kho</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.mauXe}</td>
                <td className="p-4 text-gray-600 text-sm">{item.cauHinhXe}</td>
                <td className="p-4 text-center font-bold text-lg">{item.soLuongTonKho}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                  >
                    +1
                  </button>
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    -1
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}