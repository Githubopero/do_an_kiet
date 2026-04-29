import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [newCar, setNewCar] = useState({ mauXe: '', moTa: '', trangThaiHoatDong: 'active' });

  useEffect(() => {
    fetchCars(); // Gọi hàm này để nó tận dụng logic sắp xếp bên dưới
  }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get('/admin/cars');
      const sortedData = res.data.sort((a, b) => b.id - a.id);
      setCars(sortedData);
    } catch (err) {
      console.error("Lỗi tải danh sách xe:", err);
    }
  };
  // --- LOGIC TÌM KIẾM & SẮP XẾP ---
  const filteredCars = cars.filter(car => 
    car.mauXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.moTa && car.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setCars([...cars].sort((a, b) => newOrder === 'desc' ? b.id - a.id : a.id - b.id));
  };

  // --- HÀNH ĐỘNG ---
  const handleAddCar = async (e) => {
    e.preventDefault();
    if (newCar.mauXe.trim().length < 2) {
      alert("Tên mẫu xe quá ngắn!");
      return;
    }
    try {
      await api.post('/admin/cars', newCar);
      alert('Thêm xe thành công!');
      setNewCar({ mauXe: '', moTa: '', trangThaiHoatDong: 'active' });
      setShowAddForm(false);
      fetchCars();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể thêm xe"));
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/cars/${editingCar.id}`, editingCar);
      alert("Cập nhật thành công!");
      setEditingCar(null);
      fetchCars();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Không thể cập nhật"));
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mẫu xe này? Hệ thống sẽ ngừng kinh doanh mẫu xe này và giữ lại lịch sử đơn hàng.")) return;
  try {
    await api.delete(`/admin/cars/${id}`);
    // Lọc bỏ xe vừa xóa ra khỏi danh sách hiển thị
    setCars(prevCars => prevCars.filter(c => c.id !== id));
    alert("Đã chuyển trạng thái xe sang 'Đã xóa' thành công");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xóa xe! Có thể xe đang có dữ liệu ràng buộc quan trọng.");
  }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/cars/${id}/status`, { status });
      setCars(cars.map(c => c.id === id ? { ...c, trangThaiHoatDong: status } : c));
      alert("Đã cập nhật trạng thái");
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý mẫu xe</h1>
      <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-300 text-black px-4 py-2 rounded-lg hover:bg-orange-400 font-bold transition-all"
        >
          {showAddForm ? "Hủy bỏ" : "+ Thêm mẫu xe mới"}
        </button>
      </div>
      

      {/* FORM THÊM XE */}
      {showAddForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm">
          <form onSubmit={handleAddCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên mẫu xe</label>
                <input type="text" placeholder="Tên mẫu xe (VD: VinFast VF8)" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200" 
                value={newCar.mauXe} onChange={e => setNewCar({...newCar, mauXe: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select className="p-3 border rounded-lg bg-gray-50" value={newCar.trangThaiHoatDong} onChange={e => setNewCar({...newCar, trangThaiHoatDong: e.target.value})}>
                <option value="active">Đang kinh doanh</option>
                <option value="inactive">Ngừng kinh doanh</option>
              </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                <textarea placeholder="Mô tả chi tiết về dòng xe..." className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200" rows={3}
              value={newCar.moTa} onChange={e => setNewCar({...newCar, moTa: e.target.value})} />
              </div>
              
              
            </div>
            
            <button type="submit" className="w-full bg-orange-500 text-black py-3 rounded-lg font-bold hover:bg-orange-600">Lưu mẫu xe</button>
          </form>
        </div>
      )}

      {/* THANH TÌM KIẾM */}
      <div className="mb-6 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-orange-500 flex items-center">
          <span className="mr-2"></span> Tìm kiếm người dùng
        </h2>
        <input 
          type="text"
          placeholder="Tìm theo tên mẫu xe hoặc mô tả..."
          className="w-full max-w-md pl-4 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <div className="ml-4 text-sm text-gray-500">Tìm thấy: <span className="text-orange-600">{filteredCars.length}</span> xe</div>
      </div>

      {/* Danh sách xe */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-300">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={toggleSort}>ID {sortOrder === 'desc' ? '▼' : '▲'}</th>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-left">Mô tả</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map(car => (
              <tr key={car.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-gray-400">#{car.id}</td>
                <td className="p-4 font-bold text-gray-900">{car.mauXe}</td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{car.moTa || 'Không có mô tả'}</td>
                <td className="p-4 text-center">
                  <select 
                    value={car.trangThaiHoatDong} 
                    onChange={(e) => updateStatus(car.id, e.target.value)}
                    className={`border rounded-lg px-2 py-1 text-xs font-bold ${car.trangThaiHoatDong === 'active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                  >
                    <option value="active">Đang kinh doanh</option>
                    <option value="inactive">Ngừng kinh doanh</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => setEditingCar(car)} className="text-blue-500 p-2 bg-blue-50 rounded-full hover:bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteCar(car.id)} className="text-red-400 p-2 bg-red-50 rounded-full hover:bg-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL SỬA XE */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sửa thông tin mẫu xe</h2>
            <form onSubmit={handleUpdateCar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên mẫu xe</label>
                <input type="text" className="w-full p-3 border rounded-xl" value={editingCar.mauXe}
                  onChange={e => setEditingCar({...editingCar, mauXe: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea className="w-full p-3 border rounded-xl" rows={4} value={editingCar.moTa}
                  onChange={e => setEditingCar({...editingCar, moTa: e.target.value})} />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setEditingCar(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}