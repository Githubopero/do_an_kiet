import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-orange-300 text-black px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-8">
        <img 
              src={"https://vectorseek.com/wp-content/uploads/2023/08/Vinfast-Logo-Vector.svg-.png"}
              className="w-10" 
            />
        <Link to="/" className="text-3xl font-bold">VinFast</Link>

        {/* Customer Navbar */}
        {user?.vaiTro === 'Customer' && (
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/customer" className="hover:underline">Mua Xe</Link>
            <Link to="/customer/cart" className="hover:underline">Giỏ hàng</Link>
            <Link to="/customer/orders" className="hover:underline">Đơn hàng của tôi</Link>
            <Link to="/customer/consultation" className="hover:underline">
              Yêu cầu tư vấn
            </Link>

            {/* THÊM DÒNG NÀY: Link đặt lịch lái thử */}
            <Link to="/customer/book-appointment" className="hover:underline">
              Đặt lịch lái thử
            </Link>
            <Link to="/customer/compare" className="hover:underline">So sánh xe</Link>
            {/* THÊM DÒNG NÀY: Link dẫn đến AI Tư vấn */}
            <Link to="/customer/ai-consultant" className="hover:underline">
              Gợi ý cấu hình xe
            </Link>
          </div>
        )}

        {/* Dealer & Admin sẽ dùng Sidebar riêng */}
      </div>

      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Xin chào, {user.hoTen}</span>}
        <button
          onClick={handleLogout}
          className="bg-white text-black-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}