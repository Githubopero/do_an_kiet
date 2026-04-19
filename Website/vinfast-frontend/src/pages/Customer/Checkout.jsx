import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [form, setForm] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    diaChiKhachHang: '',
    soCccd: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Bước 1: Tạo đơn hàng - Tự động gán DaiLyId = 1
      await api.post('/orders/checkout', { 
        daiLyId: 1   // ← Tự động gán đại lý mặc định
      });
      
      // Bước 2: Lưu thông tin khách hàng
      await api.post('/orders/customer-info', form);
      
      alert('Đặt hàng thành công!');
      navigate('/customer/orders');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Thanh toán đơn hàng</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Họ tên</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border rounded-lg" 
              onChange={e => setForm({...form, hoTen: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 border rounded-lg" 
              onChange={e => setForm({...form, soDienThoai: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 border rounded-lg" 
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Địa chỉ nhận xe</label>
          <textarea 
            className="w-full px-4 py-3 border rounded-lg" 
            rows={3} 
            onChange={e => setForm({...form, diaChiKhachHang: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Số CCCD</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 border rounded-lg" 
            onChange={e => setForm({...form, soCccd: e.target.value})} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-orange-300 text-black py-4 rounded-2xl text-xl font-semibold hover:bg-orange-400"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}