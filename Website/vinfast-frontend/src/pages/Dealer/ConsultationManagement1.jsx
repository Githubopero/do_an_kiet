import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function ConsultationManagement() {
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingItem, setEditingItem] = useState(null);
  
  // Trạng thái lọc bổ sung
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = () => {
    api.get('/dealer/consultations').then(res => {
      // Mặc định ID mới nhất lên đầu
      const data = res.data.sort((a, b) => b.id - a.id);
      setConsultations(data);
    });
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setConsultations([...consultations].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    ));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dealer/consultations/${editingItem.id}`, {
        mucDoUuTien: editingItem.mucDoUuTien,
        trangThaiXyLy: editingItem.trangThaiXyLy
      });
      alert('Cập nhật trạng thái thành công!');
      setEditingItem(null);
      loadConsultations();
    } catch (err) {
      alert('Lỗi khi cập nhật dữ liệu');
    }
  };

  const filteredData = useMemo(() => {
    return consultations.filter(item => {
      const matchSearch = 
        item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.soDienThoai.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mauXeQuanTam.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = filterStatus ? item.trangThaiXyLy === filterStatus : true;
      const matchPriority = filterPriority ? item.mucDoUuTien === filterPriority : true;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [consultations, searchTerm, filterStatus, filterPriority]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý yêu cầu tư vấn</h1>
        <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
          Tổng số: <strong>{filteredData.length}</strong> yêu cầu
        </div>
      </div>

      {/* Bộ lọc nâng cao */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tìm kiếm khách hàng/mẫu xe</label>
          <input 
            type="text" 
            placeholder="Tên, SĐT, Email, Mẫu xe..."
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-200"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Trạng thái</label>
          <select 
            className="w-full p-3 border rounded-xl"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="New">Mới</option>
            <option value="InProgress">Đang xử lý</option>
            <option value="Resolved">Đã giải quyết</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mức ưu tiên</label>
          <select 
            className="w-full p-3 border rounded-xl"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="">Tất cả độ ưu tiên</option>
            <option value="NORMAL">Thông thường</option>
            <option value="HIGH">Ưu tiên cao</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 cursor-pointer hover:bg-orange-400" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Mẫu xe quan tâm</th>
              <th className="p-4">Nội dung yêu cầu</th>
              <th className="p-4">Mức độ ưu tiên</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-orange-50 transition-colors">
                <td className="p-4 font-mono text-gray-400">#{item.id}</td>
                <td className="p-4">
                  <div className="font-bold text-blue-900">{item.hoTen}</div>
                  <div className="text-xs text-gray-500">{item.soDienThoai}</div>
                  <div className="text-[10px] text-gray-400 italic">{item.email}</div>
                </td>
                <td className="p-4 font-semibold text-orange-600 uppercase text-xs">
                  {item.mauXeQuanTam}
                </td>
                <td className="p-4 max-w-xs truncate" title={item.noiDung}>
                  {item.noiDung}
                </td>
                <td className="p-4 text-center">
                  {item.mucDoUuTien === 'HIGH' ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-black">Ưu tiên cao</span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px] font-black">Thông thường</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold 
                    ${item.trangThaiXyLy === 'New' ? 'bg-blue-100 text-blue-600' : 
                      item.trangThaiXyLy === 'InProgress' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-green-100 text-green-600'}`}>
                    {item.trangThaiXyLy}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-bold"
                  >
                    Xử lý
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xử lý yêu cầu */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Xử lý yêu cầu #{editingItem.id}</h2>
            <p className="text-gray-500 text-sm mb-6">Khách hàng: <span className="font-bold">{editingItem.hoTen}</span></p>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Mức độ ưu tiên</label>
                <select 
                  className="w-full border p-3 rounded-xl bg-gray-50"
                  value={editingItem.mucDoUuTien}
                  onChange={e => setEditingItem({...editingItem, mucDoUuTien: e.target.value})}
                >
                  <option value="NORMAL">NORMAL - Thông thường</option>
                  <option value="HIGH">HIGH - Ưu tiên cao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Trạng thái xử lý</label>
                <select 
                  className="w-full border p-3 rounded-xl bg-gray-50"
                  value={editingItem.trangThaiXyLy}
                  onChange={e => setEditingItem({...editingItem, trangThaiXyLy: e.target.value})}
                >
                  <option value="New">New - Mới tiếp nhận</option>
                  <option value="InProgress">InProgress - Đang tư vấn</option>
                  <option value="Resolved">Resolved - Đã hoàn tất</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)} 
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
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