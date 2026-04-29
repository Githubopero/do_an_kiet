import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarConfigManagement() {
  const [configs, setConfigs] = useState([]);
  const [cars, setCars] = useState([]);
  const [versions, setVersions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  
  // Trạng thái bổ sung cho các tính năng mới
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [editVersions, setEditVersions] = useState([]); // Lưu danh sách phiên bản dành riêng cho modal sửa
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    xeId: '',
    phienBanId: '',
    mauNgoaiThat: '',
    mauNoiThat: '',
    loaiPin: '',
    loaiNoiThat: '',
    tongGia: 0
  });
  useEffect(() => {
    loadConfigs();
    api.get('/admin/cars').then(res => setCars(res.data));
    api.get('/admin/options').then(res => setAvailableOptions(res.data));
  }, []);
// Logic load phiên bản cho Form THÊM
  useEffect(() => {
    if (form.xeId) {
      api.get(`/admin/cars/${form.xeId}/versions`).then(res => setVersions(res.data));
    } else {
      setVersions([]);
    }
  }, [form.xeId]);
// Tự động tính giá cho Form THÊM
  useEffect(() => {
    calculateTotalPrice();
  }, [form.phienBanId, form.mauNgoaiThat, form.mauNoiThat, form.loaiPin, form.loaiNoiThat]);
  // Thêm hàm này vào trước loadConfigs
const calculatePrice = (xeId, phienBanId, selectedOptionNames, versionList) => {
  const version = versionList.find(v => v.id === parseInt(phienBanId));
  let total = version ? version.giaCoBan : 0;
  selectedOptionNames.forEach(name => {
    const option = availableOptions.find(o => o.tenTuyChon === name && o.xeId === parseInt(xeId));
    if (option) total += option.anhHuongDenGia;
  });
  return total;
};

// 1. Load phiên bản cho Modal SỬA khi mở modal
useEffect(() => {
  if (editingConfig?.xeId) {
    api.get(`/admin/cars/${editingConfig.xeId}/versions`).then(res => setEditVersions(res.data));
  }
}, [editingConfig?.xeId]);

// 2. Tự động tính lại giá cho Modal SỬA khi có bất kỳ thay đổi nào
useEffect(() => {
  if (editingConfig) {
    const newPrice = calculatePrice(
      editingConfig.xeId, 
      editingConfig.phienBanId, 
      [editingConfig.mauNgoaiThat, editingConfig.mauNoiThat, editingConfig.loaiPin, editingConfig.loaiNoiThat], 
      editVersions
    );
    // Chỉ cập nhật nếu giá khác đi để tránh loop vô tận
    if (newPrice !== editingConfig.tongGia) {
      setEditingConfig(prev => ({ ...prev, tongGia: newPrice }));
    }
  }
}, [editingConfig?.phienBanId, editingConfig?.mauNgoaiThat, editingConfig?.mauNoiThat, editingConfig?.loaiPin, editingConfig?.loaiNoiThat, editVersions]);

// 3. Hàm lấy options dựa theo xeId (Dùng trong Modal)
const getOptions = (xeId, type) => {
  if (!xeId || !availableOptions) return [];
  // Sử dụng == để so sánh linh hoạt giữa chuỗi và số
  return availableOptions.filter(o => o.xeId == xeId && o.loaiTuyChon === type);
};
  const loadConfigs = () => {
    api.get('/admin/car-configs').then(res => {
        // Mặc định sắp xếp ID giảm dần khi load
        const data = res.data.sort((a, b) => b.id - a.id);
        setConfigs(data);
    });
  };

  const calculateTotalPrice = () => {
    if (!form.xeId || !form.phienBanId) return; // Chặn tính khi chưa chọn đủ
  const price = calculatePrice(
    form.xeId, 
    form.phienBanId, 
    [form.mauNgoaiThat, form.mauNoiThat, form.loaiPin, form.loaiNoiThat], 
    versions
  );
  setForm(prev => ({ ...prev, tongGia: price }));
};

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setConfigs([...configs].sort((a, b) => newOrder === 'desc' ? b.id - a.id : a.id - b.id));
  };

  const filteredConfigs = useMemo(() => {
    return configs.filter(cfg => 
      (cfg.tenXe || cfg.mauXe)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cfg.tenPhienBan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cfg.loaiPin?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [configs, searchTerm]);

  const getOptionsByType = (type) => {
    return availableOptions.filter(o => o.xeId === parseInt(form.xeId) && o.loaiTuyChon === type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/car-configs', form);
      alert('Thêm cấu hình thành công!');
      setShowAddForm(false);
      loadConfigs();
    } catch (err) { alert('Lỗi: Cấu hình không hợp lệ hoặc đã tồn tại'); }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/car-configs/${editingConfig.id}`, editingConfig);
      alert('Cập nhật thành công!');
      setEditingConfig(null);
      loadConfigs();
    } catch (err) { alert('Lỗi khi cập nhật'); }
  };

  const deleteConfig = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cấu hình này?')) {
      await api.delete(`/admin/car-configs/${id}`);
      loadConfigs();
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý cấu hình xe tiêu chuẩn</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-400 text-black px-6 py-2 rounded-xl font-bold hover:bg-orange-500 transition shadow-md"
        >
          {showAddForm ? "Hủy" : "+ Thêm cấu hình mới"}
        </button>
      </div>

      {/* Form thêm mới - Chỉ hiện khi bấm nút */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border-t-8 border-orange-300 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-orange-600">Thiết lập tổ hợp cấu hình mới</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">1. Mẫu xe</label>
                    <select className="border p-2.5 rounded-xl bg-gray-50" value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value, phienBanId: ''})} required>
                        <option value="">-- Chọn xe --</option>
                        {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">2. Phiên bản</label>
                    <select className="border p-2.5 rounded-xl bg-gray-50" value={form.phienBanId} onChange={e => setForm({...form, phienBanId: e.target.value})} disabled={!form.xeId} required>
                        <option value="">-- Chọn phiên bản --</option>
                        {versions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">3. Màu ngoại thất</label>
                    <select className="border p-2.5 rounded-xl" value={form.mauNgoaiThat} onChange={e => setForm({...form, mauNgoaiThat: e.target.value})} disabled={!form.xeId} required>
                        <option value="">-- Chọn màu sơn --</option>
                        {getOptionsByType('exterior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">4. Màu nội thất</label>
                    <select className="border p-2.5 rounded-xl" value={form.mauNoiThat} onChange={e => setForm({...form, mauNoiThat: e.target.value})} disabled={!form.xeId} required>
                        <option value="">-- Chọn nội thất --</option>
                        {getOptionsByType('interior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">5. Loại pin</label>
                    <select className="border p-2.5 rounded-xl" value={form.loaiPin} onChange={e => setForm({...form, loaiPin: e.target.value})} disabled={!form.xeId} required>
                        <option value="">-- Chọn Pin --</option>
                        {getOptionsByType('battery_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">6. Chất liệu</label>
                    <select className="border p-2.5 rounded-xl" value={form.loaiNoiThat} onChange={e => setForm({...form, loaiNoiThat: e.target.value})} disabled={!form.xeId} required>
                        <option value="">-- Chọn chất liệu --</option>
                        {getOptionsByType('interior_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Tổng giá</label>
                    <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xl font-bold text-orange-600">
                        {form.tongGia?.toLocaleString()} ₫
                    </div>
                </div>
                <button type="submit" className="lg:mt-6 bg-orange-400 text-black py-2 rounded-xl font-bold hover:bg-orange-500 transition">Xác nhận lưu</button>
            </form>
        </div>
      )}

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <h2 className="text-orange-500 font-bold">Tìm kiếm</h2>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên xe, phiên bản hoặc pin..."
          className="w-full md:w-1/3 p-3 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm hidden md:table">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 text-left cursor-pointer select-none" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4 text-left">Mẫu xe và phiên bản</th>
              <th className="p-4 text-left">Màu ngoại thất</th>
              <th className="p-4 text-left">Màu nội thất và chất liệu</th>
              <th className="p-4 text-left">Loại pin</th>
              <th className="p-4 text-right">Giá niêm yết</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredConfigs.map((cfg) => (
              <tr key={cfg.id} className="border-t hover:bg-orange-50 transition-colors">
                <td className="p-4 text-gray-500 font-mono">#{cfg.id}</td>
                <td className="p-4">
                  <div className="font-bold text-blue-900">{cfg.tenXe || cfg.mauXe}</div>
                  <div className="text-xs bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">{cfg.tenPhienBan}</div>
                </td>
                <td className="p-4">{cfg.mauNgoaiThat}</td>
                <td className="p-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase">{cfg.mauNoiThat}</div>
                    <div className="text-xs text-gray-500">{cfg.loaiNoiThat}</div>
                </td>
                <td className="p-4">{cfg.loaiPin}</td>

                {/* <td className="p-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase">{cfg.loaiPin}</div>
                    <div className="text-xs text-gray-500">{cfg.loaiNoiThat}</div>
                </td> */}
                <td className="p-4 text-right font-black text-orange-600">{cfg.tongGia.toLocaleString()} ₫</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => setEditingConfig(cfg)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Sửa</button>
                    <button onClick={() => deleteConfig(cfg.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    

      {/* MODAL SỬA - ĐÃ CẬP NHẬT SELECT & LOGIC TÍNH GIÁ */}
      {editingConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Chỉnh sửa cấu hình #{editingConfig.id}</h2>
            
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Xe (Khóa cứng) */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1 text-gray-400 text-uppercase">Mẫu xe (Không được sửa)</label>
                    <div className="p-2.5 bg-gray-100 rounded-xl font-bold text-gray-600">
                        {editingConfig.tenXe || editingConfig.mauXe}
                    </div>
                </div>

                {/* Chọn lại Phiên bản */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Chọn lại Phiên bản</label>
                    <select className="border p-2.5 rounded-xl bg-blue-50 border-blue-200" 
                      value={editingConfig.phienBanId} 
                      onChange={e => setEditingConfig({...editingConfig, phienBanId: e.target.value})}>
                        {editVersions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan} ({v.giaCoBan.toLocaleString()} ₫)</option>)}
                    </select>
                </div>

                {/* Các Option chọn lại */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Màu ngoại thất</label>
                    <select className="border p-2.5 rounded-xl" value={editingConfig.mauNgoaiThat} 
                        onChange={e => setEditingConfig({...editingConfig, mauNgoaiThat: e.target.value})}>
                        {getOptions(editingConfig.xeId, 'exterior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Màu nội thất</label>
                    <select className="border p-2.5 rounded-xl" value={editingConfig.mauNoiThat} 
                        onChange={e => setEditingConfig({...editingConfig, mauNoiThat: e.target.value})}>
                        {getOptions(editingConfig.xeId, 'interior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Loại pin</label>
                    <select className="border p-2.5 rounded-xl" value={editingConfig.loaiPin} 
                        onChange={e => setEditingConfig({...editingConfig, loaiPin: e.target.value})}>
                        {getOptions(editingConfig.xeId, 'battery_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-bold mb-1">Chất liệu nội thất</label>
                    <select className="border p-2.5 rounded-xl" value={editingConfig.loaiNoiThat} 
                        onChange={e => setEditingConfig({...editingConfig, loaiNoiThat: e.target.value})}>
                        {getOptions(editingConfig.xeId, 'interior_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                    </select>
                </div>

                {/* Tổng giá hiển thị động */}
                <div className="md:col-span-2 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Tổng giá cấu hình sau khi sửa:</span>
                        <span className="text-2xl font-black text-orange-600">{editingConfig.tongGia?.toLocaleString()} ₫</span>
                    </div>
                </div>

                <div className="md:col-span-2 flex space-x-3 mt-4">
                    <button type="button" onClick={() => setEditingConfig(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Hủy bỏ</button>
                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Lưu thay đổi</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}