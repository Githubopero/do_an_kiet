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
    fetchCars();
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

  const filteredCars = cars.filter(car => 
    car.mauXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.moTa && car.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setCars([...cars].sort((a, b) => newOrder === 'desc' ? b.id - a.id : a.id - b.id));
  };

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
    if (!window.confirm("Bạn có chắc chắn muốn xóa mẫu xe này? Hệ thống sẽ chuyển trạng thái ngừng kinh doanh.")) return;
    try {
      await api.delete(`/admin/cars/${id}`);
      setCars(prevCars => prevCars.filter(c => c.id !== id));
      alert("Đã chuyển trạng thái xe thành công");
    } catch (err) {
      alert("Lỗi khi xóa xe!");
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
    <div className="space-y-6">
      {/* Tiêu đề & Nút thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Quản lý mẫu xe</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? "✕ Hủy bỏ" : "+ Thêm mẫu xe mới"}
        </button>
      </div>

      {/* FORM THÊM XE */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-4 text-orange-600 border-b border-orange-50 pb-2">Đăng ký mẫu xe mới</h3>
          <form onSubmit={handleAddCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Tên mẫu xe</label>
                <input 
                  type="text" 
                  placeholder="VD: VinFast VF8" 
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                  value={newCar.mauXe} 
                  onChange={e => setNewCar({...newCar, mauXe: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Trạng thái ban đầu</label>
                <select 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-orange-300"
                  value={newCar.trangThaiHoatDong} 
                  onChange={e => setNewCar({...newCar, trangThaiHoatDong: e.target.value})}
                >
                  <option value="active">Đang kinh doanh</option>
                  <option value="inactive">Ngừng kinh doanh</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Mô tả chi tiết</label>
                <textarea 
                  placeholder="Mô tả sơ lược về dòng xe..." 
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                  rows={3}
                  value={newCar.moTa} 
                  onChange={e => setNewCar({...newCar, moTa: e.target.value})} 
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
              Lưu mẫu xe vào hệ thống
            </button>
          </form>
        </div>
      )}

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Tìm theo tên mẫu xe hoặc mô tả..."
            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-orange-50 rounded-xl text-orange-700 font-bold text-sm whitespace-nowrap text-center">
          Tổng cộng: {filteredCars.length} mẫu xe
        </div>
      </div>

      {/* DANH SÁCH XE (Bảng) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-orange-50 text-orange-800">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-orange-100 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '↓' : '↑'}
                </th>
                <th className="p-4">Mẫu xe</th>
                <th className="p-4">Mô tả</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-400">#{car.id}</td>
                  <td className="p-4 font-bold text-gray-800">{car.mauXe}</td>
                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {car.moTa || <span className="text-gray-300 italic">Chưa có mô tả</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <select 
                        value={car.trangThaiHoatDong} 
                        onChange={(e) => updateStatus(car.id, e.target.value)}
                        className={`text-xs font-bold border rounded-lg px-3 py-1.5 outline-none transition-all ${
                          car.trangThaiHoatDong === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        <option value="active">Đang kinh doanh</option>
                        <option value="inactive">Ngừng kinh doanh</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setEditingCar(car)} 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => deleteCar(car.id)} 
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Xóa mẫu xe"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SỬA XE (Chỉ hiện khi nhấn nút Sửa) */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Chỉnh sửa mẫu xe</h2>
            <form onSubmit={handleUpdateCar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Tên mẫu xe</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all" 
                  value={editingCar.mauXe}
                  onChange={e => setEditingCar({...editingCar, mauXe: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Mô tả</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all" 
                  rows={4} 
                  value={editingCar.moTa}
                  onChange={e => setEditingCar({...editingCar, moTa: e.target.value})} 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingCar(null)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}