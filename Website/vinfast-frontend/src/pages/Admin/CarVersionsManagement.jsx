import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarVersionsManagement() {
  const [cars, setCars] = useState([]);
  const [allVersions, setAllVersions] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVersion, setEditingVersion] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minPin: '',
    soChoNgoi: ''
  });

  const [form, setForm] = useState({
    tenPhienBan: '',
    giaCoBan: 0,
    dungLuongPin: 0,
    quangDuongDiChuyen: 0,
    soChoNgoi: 5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, versionsRes] = await Promise.all([
        api.get('/admin/cars'),
        api.get('/admin/versions/all')
      ]);
      setCars(carsRes.data);
      const data = versionsRes.data.sort((a, b) => b.id - a.id);
      setAllVersions(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu");
    }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setAllVersions([...allVersions].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    ));
  };

  const filteredVersions = useMemo(() => {
    return allVersions.filter(v => {
      const matchSearch = v.tenPhienBan.toLowerCase().includes(filters.search.toLowerCase()) || 
                          v.mauXe?.toLowerCase().includes(filters.search.toLowerCase());
      const matchCar = selectedCarId ? v.xeId === parseInt(selectedCarId) : true;
      const matchPrice = (!filters.minPrice || v.giaCoBan >= filters.minPrice) &&
                         (!filters.maxPrice || v.giaCoBan <= filters.maxPrice);
      const matchPin = !filters.minPin || v.dungLuongPin >= filters.minPin;
      const matchSoCho = !filters.soChoNgoi || v.soChoNgoi === parseInt(filters.soChoNgoi);

      return matchSearch && matchCar && matchPrice && matchPin && matchSoCho;
    });
  }, [allVersions, filters, selectedCarId]);

  const createVersion = async (e) => {
    e.preventDefault();
    if (!selectedCarId) return alert("Vui lòng chọn một mẫu xe!");
    try {
      await api.post(`/admin/cars/${selectedCarId}/versions`, form);
      alert('Thêm thành công!');
      setShowAddForm(false);
      fetchData();
      setForm({ tenPhienBan: '', giaCoBan: 0, dungLuongPin: 0, quangDuongDiChuyen: 0, soChoNgoi: 5 });
    } catch (err) { alert('Lỗi khi thêm phiên bản!'); }
  };

  const deleteVersion = async (id) => {
    if (!window.confirm("Xóa phiên bản này?")) return;
    try {
      await api.delete(`/admin/versions/${id}`);
      setAllVersions(allVersions.filter(v => v.id !== id));
      alert("Đã xóa phiên bản");
    } catch (err) { alert("Lỗi khi xóa"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/versions/${editingVersion.id}`, editingVersion);
      alert("Cập nhật thành công!");
      setEditingVersion(null);
      fetchData();
    } catch (err) { alert("Lỗi cập nhật"); }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Quản lý phiên bản xe</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? "✕ Hủy bỏ" : "+ Thêm phiên bản"}
        </button>
      </div>

      {/* FORM THÊM MỚI */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-4 text-orange-600 border-b border-orange-50 pb-2">Đăng ký phiên bản mới</h3>
          <form onSubmit={createVersion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Mẫu xe gốc</label>
                <select className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-300" value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required>
                  <option value="">- Chọn xe mẫu -</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Tên phiên bản</label>
                <input type="text" placeholder="VD: Plus, Base..." className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={form.tenPhienBan} onChange={e => setForm({...form, tenPhienBan: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Giá cơ bản (VNĐ)</label>
                <input type="number" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={form.giaCoBan} onChange={e => setForm({...form, giaCoBan: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Pin (kWh)</label>
                <input type="number" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" value={form.dungLuongPin} onChange={e => setForm({...form, dungLuongPin: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Quãng đường (km)</label>
                <input type="number" className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" value={form.quangDuongDiChuyen} onChange={e => setForm({...form, quangDuongDiChuyen: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Số chỗ ngồi</label>
                <select className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" value={form.soChoNgoi} onChange={e => setForm({...form, soChoNgoi: e.target.value})} required>
                  <option value="2">2 chỗ</option>
                  <option value="4">4 chỗ</option>
                  <option value="5">5 chỗ</option>
                  <option value="7">7 chỗ</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
              Xác nhận lưu phiên bản
            </button>
          </form>
        </div>
      )}

      {/* BỘ LỌC TÌM KIẾM */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Bộ lọc & Phân loại</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <input 
            type="text" placeholder="Tìm tên xe, phiên bản..." 
            className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-200 text-sm"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-200 text-sm"
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
          >
            <option value="">Tất cả mẫu xe</option>
            {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
          </select>
          <input 
            type="number" placeholder="Giá từ (VNĐ)..." 
            className="border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-200 text-sm"
            value={filters.minPrice}
            onChange={e => setFilters({...filters, minPrice: e.target.value})}
          />
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-orange-200 text-sm"
            value={filters.soChoNgoi}
            onChange={e => setFilters({...filters, soChoNgoi: e.target.value})}
          >
            <option value="">Số chỗ ngồi</option>
            {[2, 4, 5, 7].map(n => <option key={n} value={n}>{n} chỗ</option>)}
          </select>
          <button 
            onClick={() => {setFilters({search:'', minPrice:'', maxPrice:'', minPin:'', soChoNgoi:''}); setSelectedCarId('');}}
            className="bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 font-bold text-sm border border-gray-200 transition-all"
          >
            Làm mới bộ lọc
          </button>
        </div>
      </div>

      {/* DANH SÁCH BẢNG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-orange-50 text-orange-800">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-orange-100 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '↓' : '↑'}
                </th>
                <th className="p-4">Phiên bản</th>
                <th className="p-4">Mẫu xe</th>
                <th className="p-4 text-center">Số chỗ</th>
                <th className="p-4 text-center">Thông số kỹ thuật</th>
                <th className="p-4">Giá cơ bản</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVersions.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-400">#{v.id}</td>
                  <td className="p-4 font-bold text-gray-800">{v.tenPhienBan}</td>
                  <td className="p-4 text-blue-800 font-semibold">{v.mauXe}</td>
                  <td className="p-4 text-center">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {v.soChoNgoi || 5} chỗ
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5 items-center">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 text-[10px] font-black uppercase">
                        ⚡ {v.dungLuongPin} kWh
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 text-[10px] font-black uppercase">
                        📍 {v.quangDuongDiChuyen} km
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-orange-600">
                    {v.giaCoBan?.toLocaleString()} <span className="text-[10px] ml-0.5">₫</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingVersion(v)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteVersion(v.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SỬA */}
      {editingVersion && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Cập nhật phiên bản</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-600 mb-1">Tên phiên bản</label>
                  <input type="text" className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                    value={editingVersion.tenPhienBan} onChange={e => setEditingVersion({...editingVersion, tenPhienBan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Dung lượng pin (kWh)</label>
                  <input type="number" className="w-full p-2.5 border rounded-xl" 
                    value={editingVersion.dungLuongPin} onChange={e => setEditingVersion({...editingVersion, dungLuongPin: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Quãng đường (km)</label>
                  <input type="number" className="w-full p-2.5 border rounded-xl" 
                    value={editingVersion.quangDuongDiChuyen} onChange={e => setEditingVersion({...editingVersion, quangDuongDiChuyen: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Số chỗ ngồi</label>
                  <input type="number" className="w-full p-2.5 border rounded-xl" 
                    value={editingVersion.soChoNgoi} onChange={e => setEditingVersion({...editingVersion, soChoNgoi: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Giá cơ bản</label>
                  <input type="number" className="w-full p-2.5 border rounded-xl" 
                    value={editingVersion.giaCoBan} onChange={e => setEditingVersion({...editingVersion, giaCoBan: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingVersion(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}