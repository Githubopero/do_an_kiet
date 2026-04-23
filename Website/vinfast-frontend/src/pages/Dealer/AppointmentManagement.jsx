import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Logic sắp xếp
  const [sortOrder, setSortOrder] = useState('desc'); // mặc định giảm dần (mới nhất lên đầu)

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = () => {
    api.get('/dealer/appointments').then(res => {
        // Sắp xếp ngay khi nhận dữ liệu lần đầu
      const sortedData = res.data.sort((a, b) => b.id - a.id);
      setAppointments(res.data);
    });
  };
  // Hàm đảo chiều sắp xếp
  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setAppointments([...appointments].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    ));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dealer/appointments/${editingItem.id}`, editingItem);
      alert('Cập nhật lịch hẹn thành công!');
      setEditingItem(null);
      loadAppointments();
    } catch (err) { alert('Lỗi cập nhật'); }
  };

  const filteredData = useMemo(() => {
    return appointments.filter(item => {
      const matchSearch = 
        item.hoTenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.soDienThoai.includes(searchTerm);
      const matchStatus = filterStatus ? item.trangThai === filterStatus : true;
      return matchSearch && matchStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý lịch hẹn Showroom</h1>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tìm khách hàng</label>
          <input 
            type="text" placeholder="Tên hoặc số điện thoại..."
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trạng thái lịch</label>
          <select 
            className="w-full p-3 border rounded-xl"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Scheduled">Đã lên lịch</option>
            <option value="Completed">Đã hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-300 text-black">
            <tr>
              {/* Cột ID kèm nút đảo chiều sắp xếp */}
              <th 
                className="p-4 cursor-pointer hover:bg-orange-400 transition-colors"
                onClick={toggleSort}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  <span className="text-[10px]">
                    {sortOrder === 'desc' ? '▼' : '▲'}
                  </span>
                </div>
              </th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Thời gian hẹn</th>
              <th className="p-4">Ghi chú</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-orange-50 transition-colors">
                <td className="p-4 font-mono text-gray-400">#{item.id}</td>
                <td className="p-4">
                  <div className="font-bold text-blue-900">{item.hoTenKhachHang}</div>
                  <div className="text-xs text-gray-500 font-mono">{item.soDienThoai}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-700">
                    {new Date(item.ngayGioHen).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-xs text-orange-600 font-bold">
                    {new Date(item.ngayGioHen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="p-4 max-w-xs truncate text-gray-500 italic" title={item.ghiChu}>
                  {item.ghiChu || 'Không có ghi chú'}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm
                    ${item.trangThai === 'Scheduled' ? 'bg-blue-100 text-blue-600' : 
                      item.trangThai === 'Completed' ? 'bg-green-100 text-green-600' : 
                      'bg-red-100 text-red-600'}`}>
                    {item.trangThai}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold transition-all shadow-sm"
                  >
                    Xử lý
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Sửa */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Cập nhật lịch hẹn</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Ngày giờ hẹn</label>
                <input 
                  type="datetime-local" className="w-full border p-3 rounded-xl"
                  value={editingItem.ngayGioHen.slice(0, 16)}
                  onChange={e => setEditingItem({...editingItem, ngayGioHen: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Trạng thái</label>
                <select 
                  className="w-full border p-3 rounded-xl"
                  value={editingItem.trangThai}
                  onChange={e => setEditingItem({...editingItem, trangThai: e.target.value})}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Ghi chú</label>
                <textarea 
                  className="w-full border p-3 rounded-xl" rows="3"
                  value={editingItem.ghiChu || ''}
                  onChange={e => setEditingItem({...editingItem, ghiChu: e.target.value})}
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}