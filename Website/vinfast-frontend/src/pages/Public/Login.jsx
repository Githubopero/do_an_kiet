import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ emailOrPhone: '', matKhau: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);

    if (res.success) {
      if (res.vaiTro === 'Admin') navigate('/admin/dashboard');
      else if (res.vaiTro === 'DealerStaff') navigate('/dealer/orders');
      else navigate('/customer');
    } else {
      alert(res.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">

      {/* Lớp nền ảnh có độ mờ */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://phucvietauto.com/wp-content/uploads/2023/03/bang-gia-xe-vinfast-moi-nhat-2023242526-1024x576.jpg")', // Thay link ảnh của bạn vào đây
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3 // Chỉnh độ mờ ở đây (từ 0 đến 1)
        }}
      ></div>

      <div className="z-10 bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Đăng nhập VinFast</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email hoặc Số điện thoại"
            className="w-full px-4 py-3 border rounded-lg mb-4"
            onChange={e => setForm({ ...form, emailOrPhone: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-lg mb-6"
            onChange={e => setForm({ ...form, matKhau: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-300 text-black py-3 rounded-lg font-medium hover:bg-orange-400 disabled:opacity-70"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="text-center mt-6">
          Bạn chưa có tài khoản để trải nghiệm mua sắm? <Link to="/register" className="text-orange-500 font-medium">Đăng ký ngay!</Link>
        </p>
      </div>
    </div>
  );
}