import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = () => {
    api.get('/dealer/appointments').then(res => {
      const sortedData = res.data.sort((a, b) => b.id - a.id);
      setAppointments(sortedData);
    });
  };

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Quản lý lịch hẹn Showroom</h1>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-black text-blue-900 uppercase">Khách hẹn: {filteredData.length}</span>
        </div>
      </div>

      {/* Bộ lọc chuyên nghiệp */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Tìm khách hàng</label>
          <div className="relative">
            <input 
                type="text" placeholder="Tên hoặc số điện thoại khách hàng..."
                className="w-full p-3 pl-10 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Trạng thái lịch</label>
          <select 
            className="w-full p-3 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all"
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Scheduled">Đã lên lịch</option>
            <option value="Completed">Đã hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu - Responsive Scroll */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="bg-orange-300 text-black">
              <tr>
                <th className="p-5 font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-orange-400 transition-colors" onClick={toggleSort}>
                  <div className="flex items-center space-x-2">
                    <span>ID</span>
                    <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded">
                      {sortOrder === 'desc' ? '▼' : '▲'}
                    </span>
                  </div>
                </th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Khách hàng</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Thời gian hẹn</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Ghi chú</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs text-center">Trạng thái</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-5 font-mono text-gray-400 font-bold">#{item.id}</td>
                  <td className="p-5">
                    <div className="font-black text-blue-900 uppercase tracking-tight">{item.hoTenKhachHang}</div>
                    <div className="text-xs text-gray-500 font-bold tracking-wider">{item.soDienThoai}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <div>
                            <div className="font-black text-gray-700">{new Date(item.ngayGioHen).toLocaleDateString('vi-VN')}</div>
                            <div className="text-[11px] text-orange-600 font-black uppercase italic">
                                {new Date(item.ngayGioHen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="p-5 max-w-xs">
                    <p className="text-gray-500 italic font-medium truncate group-hover:whitespace-normal" title={item.ghiChu}>
                      {item.ghiChu || '---'}
                    </p>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm border
                      ${item.trangThai === 'Scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        item.trangThai === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {item.trangThai}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="px-5 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-black text-[11px] uppercase shadow-lg shadow-blue-50 active:scale-95"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-20 text-center bg-gray-50/50">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Không có lịch hẹn nào được tìm thấy</p>
          </div>
        )}
      </div>

      {/* Modal Sửa - Glassmorphism style */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Cập nhật lịch hẹn</h2>
                <div className="h-1.5 w-16 bg-orange-400 rounded-full mt-2"></div>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Khách hàng</p>
                 <p className="font-black text-blue-900">{editingItem.hoTenKhachHang}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ngày giờ hẹn lái thử</label>
                <input 
                  type="datetime-local" className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  value={editingItem.ngayGioHen.slice(0, 16)}
                  onChange={e => setEditingItem({...editingItem, ngayGioHen: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Trạng thái lịch</label>
                <select 
                  className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 font-bold text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all"
                  value={editingItem.trangThai}
                  onChange={e => setEditingItem({...editingItem, trangThai: e.target.value})}
                >
                  <option value="Scheduled">Scheduled - Đã lên lịch</option>
                  <option value="Completed">Completed - Đã hoàn thành</option>
                  <option value="Cancelled">Cancelled - Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ghi chú nội bộ</label>
                <textarea 
                  className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 font-medium text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all" rows="3"
                  placeholder="Nhập ghi chú về nhu cầu khách hàng..."
                  value={editingItem.ghiChu || ''}
                  onChange={e => setEditingItem({...editingItem, ghiChu: e.target.value})}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs hover:bg-gray-200 transition-all">Hủy</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}