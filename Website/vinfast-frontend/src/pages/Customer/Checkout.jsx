import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [form, setForm] = useState({
    daiLyId: '',
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChiKhachHang: '',
    soCccd: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Bước 1: Tạo đơn hàng
    await api.post('/orders/checkout', { daiLyId: parseInt(form.daiLyId) });
    
    // Bước 2: Lưu thông tin khách hàng
    await api.post('/orders/customer-info', form);
    
    alert('Đặt hàng thành công!');
    navigate('/customer/orders');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Thanh toán đơn hàng</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow">
        <div>
          <label className="block mb-2 font-medium">Chọn Đại lý</label>
          <input 
            type="number" 
            placeholder="Nhập ID Đại lý (ví dụ: 1)" 
            className="w-full px-4 py-3 border rounded-lg"
            onChange={e => setForm({...form, daiLyId: e.target.value})}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Họ tên</label>
            <input type="text" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, hoTen: e.target.value})} required />
          </div>
          <div>
            <label>Số điện thoại</label>
            <input type="tel" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, soDienThoai: e.target.value})} required />
          </div>
        </div>

        <div>
          <label>Email</label>
          <input type="email" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
        </div>

        <div>
          <label>Địa chỉ nhận xe</label>
          <textarea className="w-full px-4 py-3 border rounded-lg" rows={3} onChange={e => setForm({...form, diaChiKhachHang: e.target.value})} required />
        </div>

        <div>
          <label>Số CCCD</label>
          <input type="text" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, soCccd: e.target.value})} required />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl text-xl font-semibold hover:bg-green-700">
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}