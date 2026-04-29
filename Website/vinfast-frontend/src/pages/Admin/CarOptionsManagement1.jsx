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
    status: ''
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
    // CHUẨN HÓA DỮ LIỆU TRƯỚC KHI GỬI
  const payload = {
    xeId: parseInt(form.xeId), // Chuyển từ String sang Long (số nguyên)
    loaiTuyChon: form.loaiTuyChon,
    tenTuyChon: form.tenTuyChon,
    anhHuongDenGia: parseFloat(form.anhHuongDenGia) // Chuyển sang Decimal (số thực)
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
    if (!window.confirm("Xóa tùy chọn này?")) return;
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

  // Helper hiển thị label cho Enum
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tùy chọn xe</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-300 text-black px-4 py-2 rounded-lg hover:bg-orange-500 font-bold transition-all"
        >
          {showAddForm ? "Hủy bỏ" : "+ Thêm tùy chọn mới"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl border-2 border-blue-50 shadow-sm animate-fadeIn">
          <h3 className="text-lg font-bold mb-4 text-orange-500">Thêm tùy chọn mới</h3>
          <form onSubmit={createOption} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Mẫu xe</label>
              <select className="p-2 border rounded-lg" value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value})} required>
                <option value="">- Chọn xe -</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Loại tùy chọn</label>
              <select className="p-2 border rounded-lg" value={form.loaiTuyChon} onChange={e => setForm({...form, loaiTuyChon: e.target.value})}>
                <option value="exterior_color">Màu ngoại thất</option>
                <option value="interior_color">Màu nội thất</option>
                <option value="battery_type">Gói Pin</option>
                <option value="interior_type">Loại nội thất</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Tên tùy chọn (VD: Trắng, Pin thuê...)</label>
              <input type="text" className="p-2 border rounded-lg" value={form.tenTuyChon} onChange={e => setForm({...form, tenTuyChon: e.target.value})} required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Giá ảnh hưởng (+/- VNĐ)</label>
              <input type="number" className="p-2 border rounded-lg" value={form.anhHuongDenGia} onChange={e => setForm({...form, anhHuongDenGia: e.target.value})} required />
            </div>
            <button type="submit" className="md:col-span-4 bg-orange-400 text-black py-2 rounded-lg font-bold hover:bg-orange-500 transition-all">
              Xác nhận lưu tùy chọn
            </button>
          </form>
        </div>
      )}

      {/* FILTER SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <h1 className="text-orange-600 font-bold">Lọc tìm kiếm</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" placeholder="Tìm theo tên giá trị..." 
            className="border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none"
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
          >
            <option value="">Tất cả mẫu xe</option>
            {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
          </select>
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none"
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
          >
            <option value="">Tất cả loại tùy chọn</option>
            <option value="exterior_color">Màu ngoại thất</option>
            <option value="interior_color">Màu nội thất</option>
            <option value="battery_type">Gói Pin</option>
            <option value="interior_type">Loại nội thất</option>
          </select>
          <button 
            onClick={() => {setFilters({search:'', type:'', status:''}); setSelectedCarId('');}}
            className="bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold border border-gray-200"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 text-left cursor-pointer" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4 text-left">Tên tùy chọn</th>
              <th className="p-4 text-left">Loại tùy chọn</th>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-right">Giá chênh lệch</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOptions.map(o => (
              <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">#{o.id}</td>
                <td className="p-4 font-medium">{o.tenTuyChon}</td>

                <td className="p-4">
                   <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-bold">
                     {getOptionLabel(o.loaiTuyChon)}
                   </span>
                </td>
                <td className="p-4 font-bold text-blue-900">{o.tenXe}</td>
                
                <td className={`p-4 text-right font-bold ${o.anhHuongDenGia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {o.anhHuongDenGia > 0 ? '+' : ''}{o.anhHuongDenGia?.toLocaleString()} ₫
                </td>
                <td className="p-4 text-center">
                  {o.trangThaiKhaDung ? 
                    <span className="text-green-500">● Đang bật</span> : 
                    <span className="text-gray-400">● Tạm tắt</span>}
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => setEditingOption(o)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                      Sửa
                    </button>
                    <button onClick={() => deleteOption(o.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT */}
      {editingOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa tùy chọn</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tùy chọn</label>
                <input type="text" className="w-full border p-3 rounded-xl" 
                  value={editingOption.tenTuyChon} onChange={e => setEditingOption({...editingOption, tenTuyChon: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá chênh lệch</label>
                <input type="number" className="w-full border p-3 rounded-xl" 
                  value={editingOption.anhHuongDenGia} onChange={e => setEditingOption({...editingOption, anhHuongDenGia: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setEditingOption(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-orange-300 text-black rounded-xl font-bold hover:bg-orange-600 transition-all">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}