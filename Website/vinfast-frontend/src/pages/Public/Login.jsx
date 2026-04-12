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
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="text-center mt-6">
          Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-medium">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}