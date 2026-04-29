import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'Quản lý người dùng' },
    { path: '/admin/cars', label: 'Quản lý mẫu xe' },
    { path: '/admin/images', label: 'Quản lý hình ảnh' },
    { path: '/admin/versions', label: 'Quản lý phiên bản xe' },
    { path: '/admin/options', label: 'Quản lý tùy chọn' },
    { path: '/admin/car-configs', label: 'Cấu hình tiêu chuẩn' },
  ];

  // Hàm để đóng sidebar
  const closeSidebar = () => setIsSidebarOpen(false);
  // Hàm để mở sidebar
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navbar />

      {/* HEADER MOBILE - Đã ép Z-index cao hơn */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3 sticky top-0 z-[60] shadow-sm">
        <span className="font-bold text-orange-600 uppercase">Hệ thống Admin</span>
        <button 
          onClick={openSidebar}
          className="p-2 rounded-md bg-orange-50 text-orange-600 active:scale-95 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex flex-1">
        {/* OVERLAY - Phải có Z-index cao nhưng thấp hơn Sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[80] lg:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}

        {/* SIDEBAR - Ép Z-index lên cao nhất (z-[100]) */}
        <aside className={`
          fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r shadow-2xl transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-10
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold text-gray-800">Menu quản lý</h2>
            {/* NÚT X ĐÓNG MENU */}
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" 
              onClick={closeSidebar}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  location.pathname === item.path 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8 w-full min-w-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}