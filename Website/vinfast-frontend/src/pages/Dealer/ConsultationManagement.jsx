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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Quản lý yêu cầu tư vấn</h1>
        </div>
        <div className="text-sm bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl border border-blue-100 font-bold shadow-sm">
          Tổng số: <span className="text-lg">{filteredData.length}</span> yêu cầu
        </div>
      </div>

      {/* Bộ lọc nâng cao - Responsive Grid */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Tìm kiếm khách hàng/mẫu xe</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tên, SĐT, Email, Mẫu xe..."
              className="w-full p-3 pl-10 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Trạng thái</label>
          <select 
            className="w-full p-3 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none cursor-pointer"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="New">Mới tiếp nhận</option>
            <option value="InProgress">Đang xử lý</option>
            <option value="Resolved">Đã giải quyết</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Mức ưu tiên</label>
          <select 
            className="w-full p-3 border border-gray-100 bg-gray-50 rounded-2xl text-sm font-bold outline-none cursor-pointer"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="">Tất cả độ ưu tiên</option>
            <option value="NORMAL">Thông thường</option>
            <option value="HIGH">Ưu tiên cao</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách - Scrollable Container */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[1000px]">
            <thead className="bg-orange-300 text-black">
              <tr>
                <th className="p-5 font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-orange-400 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '▼' : '▲'}
                </th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Khách hàng</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Mẫu xe quan tâm</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs">Nội dung yêu cầu</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs text-center">Ưu tiên</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs text-center">Trạng thái</th>
                <th className="p-5 font-black uppercase tracking-widest text-xs text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="p-5 font-mono text-gray-400 font-bold">#{item.id}</td>
                  <td className="p-5">
                    <div className="font-black text-blue-900 uppercase tracking-tight">{item.hoTen}</div>
                    <div className="text-xs text-gray-500 font-bold">{item.soDienThoai}</div>
                    <div className="text-[10px] text-gray-400 italic font-medium">{item.email}</div>
                  </td>
                  <td className="p-5">
                    <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-lg font-black text-[10px] uppercase border border-orange-100">
                      {item.mauXeQuanTam}
                    </span>
                  </td>
                  <td className="p-5 max-w-xs">
                    <p className="truncate text-gray-600 leading-relaxed font-medium" title={item.noiDung}>
                      {item.noiDung}
                    </p>
                  </td>
                  <td className="p-5 text-center">
                    {item.mucDoUuTien === 'HIGH' ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm border border-red-200">Ưu tiên cao</span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm border border-green-200">Thông thường</span>
                    )}
                  </td>
                  <td className="p-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm border
                      ${item.trangThaiXyLy === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        item.trangThaiXyLy === 'InProgress' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {item.trangThaiXyLy}
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
          <div className="p-20 text-center">
             <p className="text-gray-400 italic font-bold uppercase tracking-widest">Không tìm thấy yêu cầu phù hợp.</p>
          </div>
        )}
      </div>

      {/* Modal xử lý yêu cầu - Responsive Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Xử lý yêu cầu #{editingItem.id}</h2>
                <div className="h-1.5 w-20 bg-orange-400 rounded-full mt-2"></div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-2xl mb-6 space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</p>
                <p className="font-bold text-gray-800 text-lg">{editingItem.hoTen}</p>
                <p className="text-sm text-gray-500 italic">"{editingItem.noiDung}"</p>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mức độ ưu tiên</label>
                <select 
                  className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  value={editingItem.mucDoUuTien}
                  onChange={e => setEditingItem({...editingItem, mucDoUuTien: e.target.value})}
                >
                  <option value="NORMAL">NORMAL - Thông thường</option>
                  <option value="HIGH">HIGH - Ưu tiên cao</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Trạng thái xử lý</label>
                <select 
                  className="w-full border border-gray-100 p-4 rounded-2xl bg-gray-50 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  value={editingItem.trangThaiXyLy}
                  onChange={e => setEditingItem({...editingItem, trangThaiXyLy: e.target.value})}
                >
                  <option value="New">New - Mới tiếp nhận</option>
                  <option value="InProgress">InProgress - Đang tư vấn</option>
                  <option value="Resolved">Resolved - Đã hoàn tất</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)} 
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
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