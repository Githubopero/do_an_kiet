import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Họ tên" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, hoTen: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, soDienThoai: e.target.value})} required />
          <input type="password" placeholder="Mật khẩu" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, matKhau: e.target.value})} required />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Đăng ký</button>
        </form>
        <p className="text-center mt-6">
          Đã có tài khoản? <Link to="/login" className="text-blue-600 font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}