import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarOptionsManagement() {
  const [cars, setCars] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  // Bộ lọc (Filters)
  const [filters, setFilters] = useState({
    search: '',
    type: '', // exterior_color, interior_color, etc.
  });

  // Form dựa trên CreateOptionRequest
  const [form, setForm] = useState({
    xeId: '',
    loaiTuyChon: 'exterior_color',
    tenTuyChon: '',
    anhHuongDenGia: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, optionsRes] = await Promise.all([
        api.get('/admin/cars'),
        api.get('/admin/options') 
      ]);
      setCars(carsRes.data);
      const data = optionsRes.data.sort((a, b) => b.id - a.id);
      setAllOptions(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu", err);
    }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setAllOptions([...allOptions].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    ));
  };

  const filteredOptions = useMemo(() => {
    return allOptions.filter(o => {
      const matchSearch = o.tenTuyChon.toLowerCase().includes(filters.search.toLowerCase()) || 
                          o.tenXe?.toLowerCase().includes(filters.search.toLowerCase());
      const matchCar = selectedCarId ? o.xeId === parseInt(selectedCarId) : true;
      const matchType = filters.type ? o.loaiTuyChon === filters.type : true;
      
      return matchSearch && matchCar && matchType;
    });
  }, [allOptions, filters, selectedCarId]);

  const createOption = async (e) => {
    e.preventDefault();
    if (!form.xeId) return alert("Vui lòng chọn mẫu xe!");
    
    const payload = {
      xeId: parseInt(form.xeId),
      loaiTuyChon: form.loaiTuyChon,
      tenTuyChon: form.tenTuyChon,
      anhHuongDenGia: parseFloat(form.anhHuongDenGia)
    };

    try {
      await api.post(`/admin/options`, payload);
      alert('Thêm tùy chọn thành công!');
      setShowAddForm(false);
      fetchData();
      setForm({ xeId: '', loaiTuyChon: 'exterior_color', tenTuyChon: '', anhHuongDenGia: 0 });
    } catch (err) { alert('Lỗi khi thêm tùy chọn!'); }
  };

  const deleteOption = async (id) => {
    if (!window.confirm("Xóa tùy chọn này sẽ ảnh hưởng đến các cấu hình xe hiện có. Bạn chắc chắn chứ?")) return;
    try {
      await api.delete(`/admin/options/${id}`);
      setAllOptions(allOptions.filter(o => o.id !== id));
      alert("Đã xóa thành công");
    } catch (err) { alert("Lỗi khi xóa"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/options/${editingOption.id}`, editingOption);
      alert("Cập nhật thành công!");
      setEditingOption(null);
      fetchData();
    } catch (err) { alert("Lỗi cập nhật: " + (err.response?.data?.message || err.message)); }
  };

  const getOptionLabel = (type) => {
    const labels = {
      'exterior_color': 'Màu ngoại thất',
      'interior_color': 'Màu nội thất',
      'battery_type': 'Gói Pin',
      'interior_type': 'Loại nội thất'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý tùy chọn xe</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? "✕ Hủy" : "+ Thêm tùy chọn"}
        </button>
      </div>

      {/* FORM THÊM MỚI */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold mb-6 text-orange-600 flex items-center gap-2">
             <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
             Khai báo tùy chọn mới
          </h3>
          <form onSubmit={createOption} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 italic">Áp dụng cho xe</label>
              <select className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200" 
                value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value})} required>
                <option value="">- Chọn mẫu xe -</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 italic">Phân loại</label>
              <select className="w-full p-2.5 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-200" 
                value={form.loaiTuyChon} onChange={e => setForm({...form, loaiTuyChon: e.target.value})}>
                <option value="exterior_color">Màu ngoại thất</option>
                <option value="interior_color">Màu nội thất</option>
                <option value="battery_type">Gói Pin</option>
                <option value="interior_type">Loại nội thất</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 italic">Tên giá trị</label>
              <input type="text" placeholder="VD: Trắng Crystal" className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-200" 
                value={form.tenTuyChon} onChange={e => setForm({...form, tenTuyChon: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 italic">Giá chênh lệch (₫)</label>
              <input type="number" className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-200" 
                value={form.anhHuongDenGia} onChange={e => setForm({...form, anhHuongDenGia: e.target.value})} required />
            </div>
            <button type="submit" className="md:col-span-4 bg-orange-500 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
              Lưu vào hệ thống
            </button>
          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tìm kiếm</label>
          <input 
            type="text" placeholder="Tên tùy chọn hoặc tên xe..." 
            className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className="w-full md:w-48 space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Theo xe</label>
          <select 
            className="w-full border border-gray-200 p-2.5 rounded-xl bg-white outline-none"
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
          >
            <option value="">Tất cả mẫu xe</option>
            {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
          </select>
        </div>
        <div className="w-full md:w-48 space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Theo loại</label>
          <select 
            className="w-full border border-gray-200 p-2.5 rounded-xl bg-white outline-none"
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
          >
            <option value="">Tất cả loại</option>
            <option value="exterior_color">Màu ngoại thất</option>
            <option value="interior_color">Màu nội thất</option>
            <option value="battery_type">Gói Pin</option>
            <option value="interior_type">Loại nội thất</option>
          </select>
        </div>
        <button 
          onClick={() => {setFilters({search:'', type:''}); setSelectedCarId('');}}
          className="p-2.5 px-4 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 font-bold border border-gray-200 transition-colors"
        >
          Làm mới bộ lọc
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50 text-orange-800">
                <th className="p-4 cursor-pointer hover:bg-orange-100 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '↓' : '↑'}
                </th>
                <th className="p-4 font-bold">Tên tùy chọn</th>
                <th className="p-4 font-bold">Phân loại</th>
                <th className="p-4 font-bold">Áp dụng mẫu xe</th>
                <th className="p-4 text-right font-bold">Chênh lệch giá</th>
                <th className="p-4 text-center font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOptions.length > 0 ? filteredOptions.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">#{o.id}</td>
                  <td className="p-4 font-bold text-gray-700">{o.tenTuyChon}</td>
                  <td className="p-4">
                     <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                       {getOptionLabel(o.loaiTuyChon)}
                     </span>
                  </td>
                  <td className="p-4 font-medium text-gray-600 italic">{o.tenXe}</td>
                  <td className={`p-4 text-right font-black ${o.anhHuongDenGia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {o.anhHuongDenGia > 0 ? '+' : ''}{o.anhHuongDenGia?.toLocaleString()} ₫
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingOption(o)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        Sửa
                      </button>
                      <button onClick={() => deleteOption(o.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 italic">Không tìm thấy tùy chọn nào phù hợp...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {editingOption && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-2 text-gray-800 uppercase tracking-tight">Chỉnh sửa</h2>
            <p className="text-gray-400 text-sm mb-6">Đang thay đổi thuộc tính cho ID #{editingOption.id}</p>
            
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tên tùy chọn</label>
                <input type="text" className="w-full border border-gray-200 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 font-bold" 
                  value={editingOption.tenTuyChon} onChange={e => setEditingOption({...editingOption, tenTuyChon: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Giá chênh lệch (+/-)</label>
                <input type="number" className="w-full border border-gray-200 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 font-black text-orange-600" 
                  value={editingOption.anhHuongDenGia} onChange={e => setEditingOption({...editingOption, anhHuongDenGia: e.target.value})} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingOption(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">Hủy bỏ</button>
                <button type="submit" className="flex-[2] py-3.5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}