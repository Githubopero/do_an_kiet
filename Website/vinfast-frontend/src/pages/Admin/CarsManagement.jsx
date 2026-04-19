import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ mauXe: '', moTa: '', trangThaiHoatDong: 'active' });

  useEffect(() => {
    api.get('/admin/cars').then(res => setCars(res.data));
  }, []);

  const createCar = async (e) => {
    e.preventDefault();
    await api.post('/admin/cars', form);
    alert('Thêm xe thành công!');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Quản lý xe</h1>

      {/* Form thêm xe mới */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Thêm xe mới</h2>
        <form onSubmit={createCar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tên mẫu xe"
            className="border p-3 rounded-lg"
            onChange={e => setForm({ ...form, mauXe: e.target.value })}
            required
          />
          <textarea
            placeholder="Mô tả"
            className="border p-3 rounded-lg"
            rows={2}
            onChange={e => setForm({ ...form, moTa: e.target.value })}
          />
          <button
            type="submit"
            className="bg-orange-300 text-black py-3 rounded-lg font-medium hover:bg-orange-400"
          >
            Thêm xe
          </button>
        </form>
      </div>

      {/* Danh sách xe */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-300">
            <tr>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{car.mauXe}</td>
                <td className="p-4">
                  <span className={`px-4 py-1 rounded-full text-sm ${car.trangThaiHoatDong === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {car.trangThaiHoatDong}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}