import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  // Helper kiểm tra đường dẫn hiện tại để highlight menu
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-orange-300 border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
      <div className="flex items-center gap-8">
        {/* Logo Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://vectorseek.com/wp-content/uploads/2023/08/Vinfast-Logo-Vector.svg-.png"
            className="w-10 h-auto" 
            alt="VinFast"
          />
          {/* <span className="text-2xl font-black tracking-tighter text-blue-900">VINFAST</span> */}
        </Link>

        {/* Customer Navbar Links */}
        {user?.vaiTro === 'Customer' && (
          <div className="hidden lg:flex gap-6 text-sm font-semibold tracking-tight">
            <Link to="/customer" >Danh sách xe</Link>
            <Link to="/customer/compare">So sánh phiên bản xe</Link>
            
            {/* AI Consultant Link với hiệu ứng đặc biệt */}
            <Link to="/customer/ai-consultant" className="flex items-center gap-1">
              {/* <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span> */}
              AI Gợi ý cấu hình
            </Link>

            <Link to="/customer/cart">Giỏ hàng</Link>
            <Link to="/customer/orders">Đơn hàng</Link>
            {/* <Link to="/customer/consultation" className={`${isActive('/customer/consultation')} transition-colors`}>Tư vấn</Link> */}
            <Link to="/customer/consultation">Yêu cầu tư vấn</Link>
            <Link to="/customer/book-appointment">Hẹn lịch lái thử</Link>
          </div>
        )}
      </div>

      {/* User Actions & Greeting */}
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {user.hoTen?.charAt(0).toUpperCase()}
            </div> */}
            <span className="text-sm font-medium text-gray-700">
              Xin chào, <span className="font-bold text-blue-900">{user.hoTen}</span>
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-orange-300 text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
        >
          <span>Đăng xuất</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
}