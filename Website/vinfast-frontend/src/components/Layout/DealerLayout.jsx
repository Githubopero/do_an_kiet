import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function DealerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Danh sách menu của Dealer (Đại lý)
  const menuItems = [
    { path: '/dealer/orders', label: 'Quản lý Đơn hàng' },
    { path: '/dealer/inventory', label: 'Quản lý Kho hàng' },
    { path: '/dealer/consultations', label: 'Yêu cầu tư vấn' },
    { path: '/dealer/appointments', label: 'Lịch hẹn lái thử' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navbar />

      {/* HEADER MOBILE - Thanh điều hướng phụ cho điện thoại */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3 sticky top-0 z-[60] shadow-sm">
        <span className="font-bold text-orange-600 uppercase">Hệ thống Đại lý</span>
        <button 
          onClick={openSidebar}
          className="p-2 rounded-md bg-orange-50 text-orange-600 active:scale-95 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex flex-1">
        {/* LỚP PHỦ OVERLAY KHI MỞ MENU TRÊN MOBILE */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[80] lg:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* SIDEBAR - Tự động ẩn trên mobile và hiện cố định trên máy tính */}
        <aside className={`
          fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r shadow-2xl transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-10
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex justify-between items-center border-b">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            </div>
            {/* NÚT ĐÓNG MENU TRÊN MOBILE */}
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" 
              onClick={closeSidebar}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`block px-4 py-3 rounded-xl font-bold transition-all ${
                  location.pathname === item.path 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 scale-[1.02]' 
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* NỘI DUNG CHÍNH (MAIN CONTENT) */}
        <main className="flex-1 p-4 md:p-8 w-full min-w-0 overflow-x-hidden">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 min-h-[calc(100vh-160px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}