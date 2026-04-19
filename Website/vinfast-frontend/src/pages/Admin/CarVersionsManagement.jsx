import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CarVersionsManagement() {
  const [cars, setCars] = useState([]); // Danh sách xe để chọn
  const [selectedCarId, setSelectedCarId] = useState('');
  const [versions, setVersions] = useState([]); // Danh sách phiên bản của xe đã chọn
  
  // Form dựa trên CarVersionDto
  const [form, setForm] = useState({
    tenPhienBan: '',
    giaCoBan: 0,
    dungLuongPin: 0,
    quangDuongDiChuyen: 0
  });

  // 1. Lấy danh sách xe khi vào trang để đổ vào dropdown
  useEffect(() => {
    api.get('/admin/cars').then(res => setCars(res.data));
  }, []);

  // 2. Khi chọn một xe, lấy danh sách phiên bản của xe đó
  useEffect(() => {
    if (selectedCarId) {
      api.get(`/admin/cars/${selectedCarId}/versions`).then(res => setVersions(res.data));
    } else {
      setVersions([]);
    }
  }, [selectedCarId]);

  const createVersion = async (e) => {
    e.preventDefault();
    if (!selectedCarId) return alert("Vui lòng chọn một mẫu xe trước!");

    try {
      await api.post(`/admin/cars/${selectedCarId}/versions`, form);
      alert('Thêm phiên bản xe thành công!');
      // Refresh danh sách phiên bản
      const res = await api.get(`/admin/cars/${selectedCarId}/versions`);
      setVersions(res.data);
      // Reset form
      setForm({ tenPhienBan: '', giaCoBan: 0, dungLuongPin: 0, quangDuongDiChuyen: 0 });
    } catch (err) {
      alert('Lỗi khi thêm phiên bản!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Quản lý phiên bản xe</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4 text-orange-600">Thêm phiên bản mới</h2>
        
        {/* Bước 1: Chọn mẫu xe */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Chọn mẫu xe:</label>
          <select 
            className="w-full border p-3 rounded-lg bg-gray-50"
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
          >
            <option value="">-- Chọn xe (VF 3, VF 5, ...) --</option>
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.mauXe}</option>
            ))}
          </select>
        </div>

        {/* Bước 2: Nhập thông tin phiên bản (CarVersionDto) */}
        <form onSubmit={createVersion} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tên phiên bản (VD: Eco, Plus)"
            className="border p-3 rounded-lg"
            value={form.tenPhienBan}
            onChange={e => setForm({ ...form, tenPhienBan: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Giá cơ bản (VNĐ)"
            className="border p-3 rounded-lg"
            value={form.giaCoBan}
            onChange={e => setForm({ ...form, giaCoBan: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.1"
            placeholder="Dung lượng pin (kWh)"
            className="border p-3 rounded-lg"
            value={form.dungLuongPin}
            onChange={e => setForm({ ...form, dungLuongPin: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quãng đường (km)"
            className="border p-3 rounded-lg"
            value={form.quangDuongDiChuyen}
            onChange={e => setForm({ ...form, quangDuongDiChuyen: e.target.value })}
          />
          <button
            type="submit"
            className="md:col-span-2 lg:col-span-4 bg-orange-300 text-black py-3 rounded-lg font-bold hover:bg-orange-400"
          >
            Lưu phiên bản
          </button>
        </form>
      </div>

      {/* Danh sách phiên bản của xe đang chọn */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 bg-orange-100 font-bold border-b">
          Danh sách phiên bản {selectedCarId && `của xe ID: ${selectedCarId}`}
        </div>
        <table className="w-full">
          <thead className="bg-orange-300 text-gray-600">
            <tr>
              <th className="p-4 text-left">Tên phiên bản</th>
              <th className="p-4 text-left">Giá cơ bản</th>
              <th className="p-4 text-left">Pin (kWh)</th>
              <th className="p-4 text-left">Quãng đường</th>
            </tr>
          </thead>
          <tbody>
            {versions.map(v => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold text-blue-800">{v.tenPhienBan}</td>
                <td className="p-4 text-orange-600 font-bold">{v.giaCoBan.toLocaleString()} ₫</td>
                <td className="p-4">{v.dungLuongPin} kWh</td>
                <td className="p-4">{v.quangDuongDiChuyen} km</td>
              </tr>
            ))}
            {versions.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-400 italic">
                  {selectedCarId ? 'Chưa có phiên bản nào cho mẫu xe này.' : 'Vui lòng chọn một mẫu xe để xem danh sách phiên bản.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}