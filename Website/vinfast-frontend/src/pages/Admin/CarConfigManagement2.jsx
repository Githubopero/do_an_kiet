import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CarConfigManagement() {
  const [configs, setConfigs] = useState([]);
  const [cars, setCars] = useState([]);
  const [versions, setVersions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]); // Danh sách options từ backend
  
  const [form, setForm] = useState({
    xeId: '',
    phienBanId: '',
    mauNgoaiThat: '',
    mauNoiThat: '',
    loaiPin: '',
    loaiNoiThat: '',
    tongGia: 0
  });

  // 1. Load dữ liệu ban đầu
  useEffect(() => {
    loadConfigs();
    api.get('/admin/cars').then(res => setCars(res.data));
    // Lấy toàn bộ options để dùng filter nhanh
    api.get('/admin/options').then(res => setAvailableOptions(res.data));
  }, []);

  // 2. Load phiên bản khi chọn Xe
  useEffect(() => {
    if (form.xeId) {
      api.get(`/admin/cars/${form.xeId}/versions`).then(res => setVersions(res.data));
    } else {
      setVersions([]);
    }
  }, [form.xeId]);

  // 3. Tự động tính toán lại Tổng giá khi form thay đổi
  useEffect(() => {
    calculateTotalPrice();
  }, [form.phienBanId, form.mauNgoaiThat, form.mauNoiThat, form.loaiPin, form.loaiNoiThat]);

  const loadConfigs = () => {
    api.get('/admin/car-configs').then(res => setConfigs(res.data));
  };

  // Hàm tính tổng giá tự động
  const calculateTotalPrice = () => {
    const selectedVersion = versions.find(v => v.id === parseInt(form.phienBanId));
    let total = selectedVersion ? selectedVersion.giaCoBan : 0;

    // Tìm các option đang được chọn trong form và cộng dồn giá chênh lệch
    const currentOptionNames = [form.mauNgoaiThat, form.mauNoiThat, form.loaiPin, form.loaiNoiThat];
    
    currentOptionNames.forEach(name => {
      const option = availableOptions.find(o => o.tenTuyChon === name && o.xeId === parseInt(form.xeId));
      if (option) total += option.anhHuongDenGia;
    });

    setForm(prev => ({ ...prev, tongGia: total }));
  };

  // Lọc options theo loại để hiển thị lên Select
  const getOptionsByType = (type) => {
    return availableOptions.filter(o => o.xeId === parseInt(form.xeId) && o.loaiTuyChon === type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/car-configs', form);
      alert('Thêm cấu hình thành công!');
      loadConfigs();
    } catch (err) {
      alert('Lỗi: Cấu hình không hợp lệ hoặc đã tồn tại');
    }
  };

  const deleteConfig = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cấu hình này?')) {
      await api.delete(`/admin/car-configs/${id}`);
      loadConfigs();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản lý cấu hình xe tiêu chuẩn</h1>

      {/* Form thêm mới */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border-t-8 border-orange-300">
        <h2 className="text-xl font-bold mb-6 flex items-center text-orange-600">
          <span className="mr-2">⚙️</span> Thiết lập tổ hợp cấu hình tiêu chuẩn
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CHỌN XE */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">1. Mẫu xe mẫu</label>
            <select className="border p-2.5 rounded-xl bg-gray-50" value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value, phienBanId: ''})} required>
              <option value="">-- Chọn xe --</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
            </select>
          </div>

          {/* CHỌN PHIÊN BẢN */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">2. Phiên bản</label>
            <select className="border p-2.5 rounded-xl bg-gray-50 disabled:bg-gray-200" value={form.phienBanId} onChange={e => setForm({...form, phienBanId: e.target.value})} disabled={!form.xeId} required>
              <option value="">-- Chọn phiên bản --</option>
              {versions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan} ({v.giaCoBan?.toLocaleString()} ₫)</option>)}
            </select>
          </div>

          {/* NGOẠI THẤT (Lấy từ Options) */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">3. Màu ngoại thất</label>
            <select className="border p-2.5 rounded-xl bg-white" value={form.mauNgoaiThat} onChange={e => setForm({...form, mauNgoaiThat: e.target.value})} disabled={!form.xeId} required>
              <option value="">-- Chọn màu sơn --</option>
              {getOptionsByType('exterior_color').map(o => (
                <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon} (+{o.anhHuongDenGia.toLocaleString()} ₫)</option>
              ))}
            </select>
          </div>

          {/* NỘI THẤT (Lấy từ Options) */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">4. Màu nội thất</label>
            <select className="border p-2.5 rounded-xl bg-white" value={form.mauNoiThat} onChange={e => setForm({...form, mauNoiThat: e.target.value})} disabled={!form.xeId} required>
              <option value="">-- Chọn màu nội thất --</option>
              {getOptionsByType('interior_color').map(o => (
                <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>
              ))}
            </select>
          </div>

          {/* PIN (Lấy từ Options) */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">5. Phương án Pin</label>
            <select className="border p-2.5 rounded-xl bg-white" value={form.loaiPin} onChange={e => setForm({...form, loaiPin: e.target.value})} disabled={!form.xeId} required>
              <option value="">-- Chọn loại Pin --</option>
              {getOptionsByType('battery_type').map(o => (
                <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>
              ))}
            </select>
          </div>

          {/* LOẠI NỘI THẤT (Lấy từ Options) */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">6. Chất liệu nội thất</label>
            <select className="border p-2.5 rounded-xl bg-white" value={form.loaiNoiThat} onChange={e => setForm({...form, loaiNoiThat: e.target.value})} disabled={!form.xeId} required>
              <option value="">-- Chọn chất liệu --</option>
              {getOptionsByType('interior_type').map(o => (
                <option key={o.id} value={o.tenTuyChon}>{o.tenTuyChon}</option>
              ))}
            </select>
          </div>

          {/* TỔNG GIÁ TỰ ĐỘNG */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Tổng giá dự kiến</label>
            <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xl font-bold text-orange-600">
              {form.tongGia?.toLocaleString()} <span className="text-sm underline">đ</span>
            </div>
          </div>

          <button type="submit" className="lg:mt-6 bg-orange-400 text-black py-2 rounded-xl font-bold hover:bg-orange-500 transition shadow-md">
            Lưu cấu hình tiêu chuẩn
          </button>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 text-left">Mẫu xe & Phiên bản</th>
              <th className="p-4 text-left">Ngoại thất</th>
              <th className="p-4 text-left">Nội thất</th>
              <th className="p-4 text-left">Pin & Chất liệu</th>
              <th className="p-4 text-right">Giá niêm yết</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg) => (
              <tr key={cfg.id} className="border-t hover:bg-orange-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-blue-900">{cfg.mauXe}</div>
                  <div className="text-xs bg-gray-100 inline-block px-2 py-0.5 rounded text-gray-600">{cfg.tenPhienBan}</div>
                </td>
                <td className="p-4">
                    <span className="inline-block w-3 h-3 rounded-full mr-2 bg-orange-400"></span>
                    {cfg.mauNgoaiThat}
                </td>
                <td className="p-4">{cfg.mauNoiThat}</td>
                <td className="p-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase">{cfg.loaiPin}</div>
                    <div className="text-xs text-gray-500">{cfg.loaiNoiThat}</div>
                </td>
                <td className="p-4 text-right font-black text-lg text-orange-600">{cfg.tongGia.toLocaleString()} ₫</td>
                <td className="p-4 text-center">
                  <button onClick={() => deleteConfig(cfg.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}