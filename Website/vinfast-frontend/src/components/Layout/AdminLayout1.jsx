import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex w-full">
        <aside className="w-64 bg-white border-r h-screen p-6">
          <nav className="space-y-2">
            <a href="/admin/dashboard" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">Dashboard</a>
            <a href="/admin/users" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">Quản lý người dùng</a>
            <a href="/admin/cars" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">Quản lý mẫu xe</a>
            {/* MỤC MỚI THÊM Ở ĐÂY */}
              <a href="/admin/images" className="bg-orange-100 text-black block px-4 py-3 rounded-lg hover:bg-orange-500 transition shadow-sm my-1">
                Quản lý hình ảnh
              </a>
            <a href="/admin/versions" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">Quản lý phiên bản xe</a>
            {/* THÊM DÒNG NÀY ĐỂ HIỂN THỊ MENU TÙY CHỌN */}
            <a href="/admin/options" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">
              Quản lý tùy chọn
            </a>
            <a href="/admin/car-configs" className="bg-orange-100 block px-4 py-3 rounded-lg hover:bg-orange-200">Quản lý cấu hình tiêu chuẩn</a>
            
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}