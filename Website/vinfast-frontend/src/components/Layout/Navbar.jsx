import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold">VinFast</Link>
        
        {user && (
          <div className="flex gap-6 text-sm">
            {user.vaiTro === 'Customer' && <Link to="/customer" className="hover:underline">Mua Xe</Link>}
            {user.vaiTro === 'DealerStaff' && <Link to="/dealer/orders" className="hover:underline">Đơn hàng</Link>}
            {user.vaiTro === 'Admin' && <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user && <span>Xin chào, {user.hoTen}</span>}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}