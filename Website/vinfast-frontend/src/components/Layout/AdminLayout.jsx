import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex w-full">
        <aside className="w-64 bg-white border-r h-screen p-6">
          <nav className="space-y-2">
            <a href="/admin/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-100">📊 Dashboard</a>
            <a href="/admin/cars" className="block px-4 py-3 rounded-lg hover:bg-gray-100">🚗 Quản lý xe</a>
            <a href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-gray-100">👤 Quản lý người dùng</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}