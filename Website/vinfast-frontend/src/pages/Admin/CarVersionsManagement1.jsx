import { useEffect, useState,useMemo } from 'react';
import api from '../../services/api';

export default function CarVersionsManagement() {
  const [cars, setCars] = useState([]); // Danh sách xe để chọn
  const [allVersions, setAllVersions] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // Quản lý sắp xếp
  const [showAddForm, setShowAddForm] = useState(false); // Quản lý ẩn hiện form
  const [editingVersion, setEditingVersion] = useState(null);
  
  // Bộ lọc (Filters)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minPin: '',
    maxDistance: '',
    soChoNgoi: ''
  });
  // Form dựa trên CarVersionDto
  const [form, setForm] = useState({
    tenPhienBan: '',
    giaCoBan: 0,
    dungLuongPin: 0,
    quangDuongDiChuyen: 0,
    soChoNgoi: ''
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
      // Mặc định sắp xếp giảm dần theo ID
      const data = versionsRes.data.sort((a, b) => b.id - a.id);
      setAllVersions(data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu");
    }
  };

  // Logic Sắp xếp
  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setAllVersions([...allVersions].sort((a, b) => 
      newOrder === 'desc' ? b.id - a.id : a.id - b.id
    ));
  };

  // Logic Lọc dữ liệu (Search & Filter) sử dụng useMemo để tối ưu hiệu năng
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
      setShowAddForm(false); // Đóng form sau khi thêm
      fetchData(); // Tải lại danh sách
      setForm({ tenPhienBan: '', giaCoBan: 0, dungLuongPin: 0, quangDuongDiChuyen: 0, soChoNgoi: 5 });
    } catch (err) { alert('Lỗi khi thêm phiên bản!'); }
  };
  const deleteVersion = async (id) => {
    if (!window.confirm("Xóa phiên bản này?")) return;
    try {
      await api.delete(`/admin/versions/${id}`); // Giả sử bạn có route này
      setAllVersions(allVersions.filter(v => v.id !== id));
      alert("Đã xóa phiên bản");
    } catch (err) { alert("Lỗi khi xóa"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/versions/${editingVersion.id}`, editingVersion);
      // 2. Cập nhật trực tiếp vào state allVersions để giao diện thay đổi ngay lập tức
    setAllVersions(prevVersions => 
      prevVersions.map(v => v.id === editingVersion.id ? { ...editingVersion } : v)
    );
      alert("Cập nhật thành công!");
      setEditingVersion(null);
      fetchData();
    } catch (err) { alert("Lỗi cập nhật"+ (err.response?.data?.message || err.message)); }
  };

  return (
    <div className="p-6">
      {/* HEADER GIỐNG QUẢN LÝ NGƯỜI DÙNG */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý phiên bản xe</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-300 text-black px-4 py-2 rounded-lg hover:bg-orange-400 font-bold transition-all"
        >
          {showAddForm ? "Hủy bỏ" : "+ Thêm phiên bản"}
        </button>
      </div>

      {/* FORM THÊM MỚI (CHỈ HIỆN KHI CLICK NÚT) */}
      {showAddForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm animate-fadeIn">
          <h3 className="text-lg font-bold mb-4 text-orange-600">Thêm phiên bản xe mới</h3>
          <form onSubmit={createVersion} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Mẫu xe gốc</label>
              <select className="p-2 border rounded-lg bg-gray-50" value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} required>
                <option value="">-Chọn xe mẫu-</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Tên phiên bản</label>
              <input type="text" placeholder="VD: Plus, Base..." className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300" 
                value={form.tenPhienBan} onChange={e => setForm({...form, tenPhienBan: e.target.value})} required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Giá cơ bản (VNĐ)</label>
              <input type="number" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-300" 
                value={form.giaCoBan} onChange={e => setForm({...form, giaCoBan: e.target.value})} required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Dung lượng pin (kWh)</label>
            <input type="number" placeholder="Pin (kWh)" className="p-2 border rounded-lg" value={form.dungLuongPin} onChange={e => setForm({...form, dungLuongPin: e.target.value})} required/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Quãng đường di chuyển (km)</label>
            <input type="number" placeholder="Quãng đường di chuyển(km)" className="p-2 border rounded-lg" value={form.quangDuongDiChuyen} onChange={e => setForm({...form, quangDuongDiChuyen: e.target.value})} required/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Số chỗ ngồi</label>
            <select className="p-2 border rounded-lg" value={form.soChoNgoi} onChange={e => setForm({...form, soChoNgoi: e.target.value})} required>
              <option value="">-Chọn số chỗ-</option>
              <option value="2">2 chỗ</option>
              <option value="4">4 chỗ</option>
              <option value="5">5 chỗ</option>
              <option value="7">7 chỗ</option>
            </select>
            </div>
            
            <button type="submit" className="md:col-span-3 bg-orange-500 text-black py-2 rounded-lg font-bold hover:bg-orange-600 transition-all shadow-lg">
              Xác nhận lưu phiên bản
            </button>
          </form>
        </div>
      )}

      {/* THANH TÌM KIẾM (Style đồng bộ) */}
      {/* <div className="mb-6 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text"
            placeholder="Tìm theo tên xe hoặc phiên bản..."
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300"
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <select 
          className="border border-gray-200 p-2 rounded-xl outline-none"
          value={selectedCarId}
          onChange={e => setSelectedCarId(e.target.value)}
        >
          <option value="">Tất cả mẫu xe</option>
          {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
        </select>
      </div> */}

      {/* FILTER SECTION (Tích hợp tìm kiếm và lọc nâng cao) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 transition-all hover:shadow-md">
        <h2 className="text-lg font-bold mb-4 text-orange-500 flex items-center">
          <span className="mr-2"></span> Bộ lọc tìm kiếm và phân loại
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="relative">
            <input 
              type="text" placeholder="Tìm tên xe, phiên bản..." 
              className="w-full border border-gray-200 p-2.5 pl-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
          >
            <option value="">-- Tất cả mẫu xe --</option>
            {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
          </select>
          <input 
            type="number" placeholder="Giá từ (VNĐ)..." 
            className="border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
            value={filters.minPrice}
            onChange={e => setFilters({...filters, minPrice: e.target.value})}
          />
          <select 
            className="border border-gray-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={filters.soChoNgoi}
            onChange={e => setFilters({...filters, soChoNgoi: e.target.value})}
          >
            <option value="">-- Số chỗ ngồi --</option>
            <option value="2">2 chỗ</option>
            <option value="3">3 chỗ</option>
            <option value="4">4 chỗ</option>
            <option value="5">5 chỗ</option>
            <option value="7">7 chỗ</option>
          </select>
          <button 
            onClick={() => {setFilters({search:'', minPrice:'', maxPrice:'', minPin:'', soChoNgoi:''}); setSelectedCarId('');}}
            className="bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold transition-all border border-gray-200"
          >
            Làm mới bộ lọc
          </button>
        </div>
      </div>


      {/* DANH SÁCH HIỂN THỊ */}
      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 text-left cursor-pointer hover:bg-gray-700 transition-all" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4 text-left">Tên phiên bản</th>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-center">Số chỗ</th>
              <th className="p-4 text-center">Dung lượng pin</th>
              <th className="p-4 text-center">Quãng đường di chuyển</th>
              <th className="p-4 text-left">Giá cơ bản</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredVersions.map(v => (
              <tr key={v.id} className="border-t hover:bg-blue-50 transition-colors">
                <td className="p-4 font-mono text-gray-500 text-sm">#{v.id}</td>
                <td className="p-4 font-medium">{v.tenPhienBan}</td>
                <td className="p-4 font-bold text-blue-900">{v.mauXe}</td>
                <td className="p-4 text-center">{v.soChoNgoi || 5}</td>
                <td className="p-4 text-center">
                   <div className="flex flex-col gap-1 items-center">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{v.dungLuongPin} kWh</span>
                   </div>
                </td>
                <td className="p-4 text-center">
                   <div className="flex flex-col gap-1 items-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{v.quangDuongDiChuyen} km</span>
                   </div>
                </td>
                <td className="p-4 text-orange-600 font-bold">{v.giaCoBan?.toLocaleString()} ₫</td>
                <td className="p-4">
                   <div className="flex justify-center space-x-2">
                      <button onClick={() => setEditingVersion(v)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteVersion(v.id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100">
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

      {/* MODAL SỬA PHIÊN BẢN (Giữ nguyên hoặc tùy chỉnh theo style modal User) */}
      {editingVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa phiên bản</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phiên bản</label>
                <input type="text" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={editingVersion.tenPhienBan} onChange={e => setEditingVersion({...editingVersion, tenPhienBan: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng pin</label>
                <input type="number" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={editingVersion.dungLuongPin} onChange={e => setEditingVersion({...editingVersion, dungLuongPin: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quãng đường di chuyển</label>
                <input type="number" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={editingVersion.quangDuongDiChuyen} onChange={e => setEditingVersion({...editingVersion, quangDuongDiChuyen: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số chỗ ngồi</label>
                <input type="number" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={editingVersion.soChoNgoi} onChange={e => setEditingVersion({...editingVersion, soChoNgoi: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản</label>
                <input type="number" className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-300" 
                  value={editingVersion.giaCoBan} onChange={e => setEditingVersion({...editingVersion, giaCoBan: e.target.value})} />
              </div>
              {/* Thêm các trường khác nếu cần... */}
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setEditingVersion(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
}