import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CarConfigManagement() {
  const [configs, setConfigs] = useState([]);
  const [cars, setCars] = useState([]);
  const [versions, setVersions] = useState([]);
  
  const [form, setForm] = useState({
    xeId: '',
    phienBanId: '',
    mauNgoaiThat: '',
    mauNoiThat: '',
    loaiPin: 'Pin thuê',
    loaiNoiThat: 'Da tổng hợp',
    tongGia: 0
  });

  // 1. Load dữ liệu ban đầu
  useEffect(() => {
    loadConfigs();
    api.get('/admin/cars').then(res => setCars(res.data));
  }, []);

  // 2. Load phiên bản khi chọn Xe
  useEffect(() => {
    if (form.xeId) {
      api.get(`/admin/cars/${form.xeId}/versions`).then(res => setVersions(res.data));
    } else {
      setVersions([]);
    }
  }, [form.xeId]);

  const loadConfigs = () => {
    api.get('/admin/car-configs').then(res => setConfigs(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/car-configs', form);
      alert('Thêm cấu hình thành công!');
      loadConfigs();
      setForm({ ...form, mauNgoaiThat: '', mauNoiThat: '', tongGia: 0 });
    } catch (err) {
      alert('Lỗi: Cấu hình không hợp lệ');
    }
  };

  const deleteConfig = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cấu hình này?')) {
      await api.delete(`/admin/car-configs/${id}`);
      loadConfigs();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Quản lý cấu hình xe</h1>

      {/* Form thêm mới */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10 border-t-4 border-orange-400">
        <h2 className="text-xl font-semibold mb-6">Tạo tổ hợp cấu hình mới</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Mẫu xe</label>
            <select className="w-full border p-2 rounded" value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value})} required>
              <option value="">-- Chọn xe --</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phiên bản</label>
            <select className="w-full border p-2 rounded" value={form.phienBanId} onChange={e => setForm({...form, phienBanId: e.target.value})} required>
              <option value="">-- Chọn phiên bản --</option>
              {versions.map(v => <option key={v.id} value={v.id}>{v.tenPhienBan}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Màu ngoại thất</label>
            <input type="text" className="w-full border p-2 rounded" value={form.mauNgoaiThat} onChange={e => setForm({...form, mauNgoaiThat: e.target.value})} placeholder="VD: Trắng Brahminy" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Màu nội thất</label>
            <input type="text" className="w-full border p-2 rounded" value={form.mauNoiThat} onChange={e => setForm({...form, mauNoiThat: e.target.value})} placeholder="VD: Đen Granite" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại Pin</label>
            <select className="w-full border p-2 rounded" value={form.loaiPin} onChange={e => setForm({...form, loaiPin: e.target.value})}>
              <option value="Pin thuê">Pin thuê</option>
              <option value="Mua pin">Mua pin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giá tổng cuối (VNĐ)</label>
            <input type="number" className="w-full border p-2 rounded font-bold text-orange-600" value={form.tongGia} onChange={e => setForm({...form, tongGia: e.target.value})} required />
          </div>

          <button type="submit" className="md:col-span-3 bg-orange-300 text-black py-3 rounded-lg hover:bg-orange-400 transition">
            Lưu cấu hình hệ thống
          </button>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-orange-300 text-gray-700">
            <tr>
              <th className="p-4 text-left">Xe và phiên bản</th>
              <th className="p-4 text-left">Ngoại thất</th>
              <th className="p-4 text-left">Nội thất</th>
              <th className="p-4 text-left">Pin</th>
              <th className="p-4 text-right">Giá niêm yết</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg) => (
              <tr key={cfg.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-bold">{cfg.mauXe}</div>
                  <div className="text-xs text-gray-500">{cfg.tenPhienBan}</div>
                </td>
                <td className="p-4">{cfg.mauNgoaiThat}</td>
                <td className="p-4">{cfg.mauNoiThat}</td>
                <td className="p-4"><span className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs">{cfg.loaiPin}</span></td>
                <td className="p-4 text-right font-bold">{cfg.tongGia.toLocaleString()} ₫</td>
                <td className="p-4 text-center">
                  <button onClick={() => deleteConfig(cfg.id)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}