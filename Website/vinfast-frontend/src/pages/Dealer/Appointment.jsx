import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Appointment() {
  const [form, setForm] = useState({
    daiLyId: '',
    ngayGioHen: '',
    ghiChu: ''
  });
  const [dealers, setDealers] = useState([]);

  useEffect(() => {
    api.get('/dealers').then(res => setDealers(res.data)); // giả sử bạn có endpoint này
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/appointments', form);
    alert('Đặt lịch hẹn thành công!');
    // reset form nếu cần
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl">
      <h1 className="text-3xl font-bold mb-8">Đặt lịch hẹn / Test drive</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select className="w-full border p-4 rounded-2xl" onChange={e => setForm({...form, daiLyId: e.target.value})} required>
          <option value="">Chọn đại lý</option>
          {dealers.map(d => <option key={d.id} value={d.id}>{d.tenDaiLy}</option>)}
        </select>

        <input type="datetime-local" className="w-full border p-4 rounded-2xl" required
          onChange={e => setForm({...form, ngayGioHen: e.target.value})} />

        <textarea placeholder="Ghi chú thêm" className="w-full border p-4 rounded-2xl" rows={4}
          onChange={e => setForm({...form, ghiChu: e.target.value})} />

        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl text-xl font-semibold hover:bg-green-700">
          Xác nhận đặt lịch
        </button>
      </form>
    </div>
  );
}