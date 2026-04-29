import { useEffect, useState } from 'react'; // Thêm useState
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái đóng mở menu mobile

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Helper highlight menu
  const isActive = (path) => location.pathname === path 
    ? "text-blue-900 font-black scale-105" 
    : "text-gray-800 hover:text-blue-700";

  return (
    <nav className="bg-orange-300 border-b border-orange-400 px-6 py-3 sticky top-0 z-[100] shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Nút Menu Mobile (Hamburger) */}
          <button 
            className="lg:hidden text-blue-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>

          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://vectorseek.com/wp-content/uploads/2023/08/Vinfast-Logo-Vector.svg-.png"
              className="w-8 md:w-10 h-auto" 
              alt="VinFast"
            />
          </Link>

          {/* Desktop Navbar Links */}
          {user?.vaiTro === 'Customer' && (
            <div className="hidden lg:flex gap-6 text-[13px] font-black tracking-tight">
              <Link to="/customer" className={isActive('/customer')}>Danh sách xe</Link>
              <Link to="/customer/compare" className={isActive('/customer/compare')}>So sánh phiên bản</Link>
              <Link to="/customer/ai-consultant" className={`${isActive('/customer/ai-consultant')} flex items-center gap-1`}>
                {/* <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-700"></span>
                </span> */}
                AI Gợi ý cấu hình
              </Link>
              <Link to="/customer/cart" className={isActive('/customer/cart')}>Giỏ hàng của tôi</Link>
              <Link to="/customer/orders" className={isActive('/customer/orders')}>Đơn hàng của tôi</Link>
              <Link to="/customer/consultation" className={isActive('/customer/consultation')}>Yêu cầu tư vấn</Link>
              <Link to="/customer/book-appointment" className={isActive('/customer/book-appointment')}>Hẹn lịch lái thử</Link>
            </div>
          )}
        </div>

        {/* User Actions & Greeting */}
<div className="flex items-center gap-2 sm:gap-4">
  {user && (
    <div className="text-right flex flex-col justify-center">
      <p className="text-[9px] md:text-[10px] font-black text-blue-900 uppercase leading-none">Xin chào</p>
      <p className="text-[11px] md:text-sm font-black text-gray-800 truncate max-w-[80px] md:max-w-none">
        {user.hoTen}
      </p>
    </div>
  )}

  <button
    onClick={handleLogout}
    className="bg-white/20 hover:bg-red-600 hover:text-white text-black p-2 md:px-4 md:py-2 rounded-xl text-sm font-black transition-all border border-black/10 flex items-center gap-2"
  >
    {/* Trên mobile chỉ hiện icon cho gọn, trên desktop hiện cả chữ */}
    <span className="hidden md:inline">Đăng xuất</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  </button>
</div>
      </div>

      {/* Mobile Menu Dropdown (Hiển thị khi isMenuOpen = true) */}
      {isMenuOpen && user?.vaiTro === 'Customer' && (
        <div className="lg:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-orange-400/50 pt-4 animate-in slide-in-from-top duration-300">
          <Link to="/customer" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer')}`}>Danh sách xe</Link>
          <Link to="/customer/compare" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/compare')}`}>So sánh phiên bản</Link>
          <Link to="/customer/ai-consultant" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/ai-consultant')}`}>AI Gợi ý cấu hình</Link>
          <Link to="/customer/cart" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/cart')}`}>Giỏ hàng</Link>
          <Link to="/customer/orders" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/orders')}`}>Đơn hàng</Link>
          <Link to="/customer/consultation" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/consultation')}`}>Yêu cầu tư vấn</Link>
          <Link to="/customer/book-appointment" className={`p-2 rounded-lg font-black uppercase text-sm ${isActive('/customer/book-appointment')}`}>Hẹn lịch lái thử</Link>
          
          <div className="sm:hidden p-2 border-t border-orange-400/30 mt-2">
             <p className="text-[10px] font-black text-blue-900 uppercase">Đang đăng nhập:</p>
             <p className="font-black text-gray-800">{user.hoTen}</p>
          </div>
        </div>
      )}
    </nav>
  );
}