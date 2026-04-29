import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarConfigManagement() {
  const [configs, setConfigs] = useState([]);
  const [cars, setCars] = useState([]);
  const [versions, setVersions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [editVersions, setEditVersions] = useState([]); 
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

  useEffect(() => {
    if (form.xeId) {
      api.get(`/admin/cars/${form.xeId}/versions`).then(res => setVersions(res.data));
    } else {
      setVersions([]);
    }
  }, [form.xeId]);

  useEffect(() => {
    calculateTotalPrice();
  }, [form.phienBanId, form.mauNgoaiThat, form.mauNoiThat, form.loaiPin, form.loaiNoiThat]);

  const calculatePrice = (xeId, phienBanId, selectedOptionNames, versionList) => {
    const version = versionList.find(v => v.id === parseInt(phienBanId));
    let total = version ? version.giaCoBan : 0;
    selectedOptionNames.forEach(name => {
      const option = availableOptions.find(o => o.tenTuyChon === name && o.xeId === parseInt(xeId));
      if (option) total += option.anhHuongDenGia;
    });
    return total;
  };

  useEffect(() => {
    if (editingConfig?.xeId) {
      api.get(`/admin/cars/${editingConfig.xeId}/versions`).then(res => setEditVersions(res.data));
    }
  }, [editingConfig?.xeId]);

  useEffect(() => {
    if (editingConfig) {
      const newPrice = calculatePrice(
        editingConfig.xeId, 
        editingConfig.phienBanId, 
        [editingConfig.mauNgoaiThat, editingConfig.mauNoiThat, editingConfig.loaiPin, editingConfig.loaiNoiThat], 
        editVersions
      );
      if (newPrice !== editingConfig.tongGia) {
        setEditingConfig(prev => ({ ...prev, tongGia: newPrice }));
      }
    }
  }, [editingConfig?.phienBanId, editingConfig?.mauNgoaiThat, editingConfig?.mauNoiThat, editingConfig?.loaiPin, editingConfig?.loaiNoiThat, editVersions]);

  const getOptions = (xeId, type) => {
    if (!xeId || !availableOptions) return [];
    return availableOptions.filter(o => o.xeId == xeId && o.loaiTuyChon === type);
  };

  const loadConfigs = () => {
    api.get('/admin/car-configs').then(res => {
        const data = res.data.sort((a, b) => b.id - a.id);
        setConfigs(data);
    });
  };

  const calculateTotalPrice = () => {
    if (!form.xeId || !form.phienBanId) return;
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
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý cấu hình xe tiêu chuẩn</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? "✕ Hủy bỏ" : "+ Thêm cấu hình mới"}
        </button>
      </div>

      {/* FORM THÊM MỚI */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold mb-6 text-orange-600 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
            Thiết lập tổ hợp cấu hình mới
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">1. Mẫu xe</label>
                <select className="w-full border p-2.5 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none" 
                  value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value, phienBanId: ''})} required>
                  <option value="">-- Chọn xe --</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">2. Phiên bản</label>
                <select className="w-full border p-2.5 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none" 
                  value={form.phienBanId} onChange={e => setForm({...form, phienBanId: e.target.value})} disabled={!form.xeId} required>
                  <option value="">-- Chọn phiên bản --</option>
                  {versions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">3. Màu ngoại thất</label>
                <select className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                  value={form.mauNgoaiThat} onChange={e => setForm({...form, mauNgoaiThat: e.target.value})} disabled={!form.xeId} required>
                  <option value="">-- Chọn màu sơn --</option>
                  {getOptionsByType('exterior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">4. Màu nội thất</label>
                <select className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                  value={form.mauNoiThat} onChange={e => setForm({...form, mauNoiThat: e.target.value})} disabled={!form.xeId} required>
                  <option value="">-- Chọn màu nội thất --</option>
                  {getOptionsByType('interior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-gray-400">5. Loại pin & Chất liệu</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="border p-2.5 rounded-xl outline-none" value={form.loaiPin} 
                    onChange={e => setForm({...form, loaiPin: e.target.value})} disabled={!form.xeId} required>
                    <option value="">Pin</option>
                    {getOptionsByType('battery_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                  </select>
                  <select className="border p-2.5 rounded-xl outline-none" value={form.loaiNoiThat} 
                    onChange={e => setForm({...form, loaiNoiThat: e.target.value})} disabled={!form.xeId} required>
                    <option value="">Chất liệu</option>
                    {getOptionsByType('interior_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-bold text-orange-400 uppercase">Ước tính giá</span>
                  <span className="text-lg font-black text-orange-600">{form.tongGia?.toLocaleString()} ₫</span>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
              Xác nhận và lưu cấu hình
            </button>
          </form>
        </div>
      )}

      {/* TÌM KIẾM */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Tìm kiếm nhanh cấu hình..."
          className="w-full md:w-96 p-3 pl-10 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
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
                <th className="p-4">Mẫu xe & Phiên bản</th>
                <th className="p-4">Ngoại thất</th>
                <th className="p-4">Nội thất & Chất liệu</th>
                <th className="p-4">Loại pin</th>
                <th className="p-4 text-right">Giá niêm yết</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredConfigs.map((cfg) => (
                <tr key={cfg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">#{cfg.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{cfg.tenXe || cfg.mauXe}</div>
                    <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block uppercase">
                      {cfg.tenPhienBan}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" style={{backgroundColor: '#ccc'}}></span>
                      <span className="text-sm">{cfg.mauNgoaiThat}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-700">{cfg.mauNoiThat}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{cfg.loaiNoiThat}</div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-green-700 italic">
                    ⚡ {cfg.loaiPin}
                  </td>
                  <td className="p-4 text-right font-black text-orange-600">
                    {cfg.tongGia.toLocaleString()} <span className="text-[10px] ml-0.5">₫</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingConfig(cfg)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteConfig(cfg.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* MOBILE LIST VIEWER (Ẩn trên màn hình lớn) */}
      {/* <div className="md:hidden space-y-4">
        {filteredConfigs.map((cfg) => (
          <div key={cfg.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 font-mono text-xs">#{cfg.id}</span>
              <span className="font-black text-orange-600">{cfg.tongGia.toLocaleString()} ₫</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">{cfg.tenXe || cfg.mauXe}</div>
              <div className="text-xs text-blue-600 font-bold">{cfg.tenPhienBan}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">🎨 {cfg.mauNgoaiThat}</div>
              <div className="bg-gray-50 p-2 rounded">⚡ {cfg.loaiPin}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingConfig(cfg)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">Sửa</button>
              <button onClick={() => deleteConfig(cfg.id)} className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg font-bold text-sm">Xóa</button>
            </div>
          </div>
        ))}
      </div> */}

      {/* MODAL SỬA */}
      {editingConfig && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-blue-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">ID</span>
              Cấu hình #{editingConfig.id}
            </h2>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Mẫu xe (Khóa)</label>
                        <div className="p-3 bg-gray-100 rounded-xl font-bold text-gray-500">
                            {editingConfig.tenXe || editingConfig.mauXe}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">Phiên bản</label>
                        <select className="w-full border p-3 rounded-xl bg-blue-50 border-blue-200 outline-none font-bold" 
                          value={editingConfig.phienBanId} 
                          onChange={e => setEditingConfig({...editingConfig, phienBanId: e.target.value})}>
                            {editVersions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan} ({v.giaCoBan.toLocaleString()} ₫)</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">Màu ngoại thất</label>
                        <select className="w-full border p-3 rounded-xl outline-none" value={editingConfig.mauNgoaiThat} 
                            onChange={e => setEditingConfig({...editingConfig, mauNgoaiThat: e.target.value})}>
                            {getOptions(editingConfig.xeId, 'exterior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">Màu nội thất</label>
                        <select className="w-full border p-3 rounded-xl outline-none" value={editingConfig.mauNoiThat} 
                            onChange={e => setEditingConfig({...editingConfig, mauNoiThat: e.target.value})}>
                            {getOptions(editingConfig.xeId, 'interior_color').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">Loại pin</label>
                        <select className="w-full border p-3 rounded-xl outline-none" value={editingConfig.loaiPin} 
                            onChange={e => setEditingConfig({...editingConfig, loaiPin: e.target.value})}>
                            {getOptions(editingConfig.xeId, 'battery_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">Chất liệu nội thất</label>
                        <select className="w-full border p-3 rounded-xl outline-none" value={editingConfig.loaiNoiThat} 
                            onChange={e => setEditingConfig({...editingConfig, loaiNoiThat: e.target.value})}>
                            {getOptions(editingConfig.xeId, 'interior_type').map(o => <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Tổng cộng niêm yết</div>
                        <div className="text-sm text-gray-500 font-medium">Đã bao gồm VAT và phụ phí lựa chọn</div>
                    </div>
                    <div className="text-3xl font-black text-orange-600">
                      {editingConfig.tongGia?.toLocaleString()} <span className="text-sm">₫</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={() => setEditingConfig(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-colors">Hủy</button>
                    <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">Lưu thay đổi</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}