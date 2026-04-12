import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function DealerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex w-full">
        <aside className="w-64 bg-white border-r h-screen p-6">
          <nav className="space-y-2">
            <a href="/dealer/orders" className="block px-4 py-3 rounded-lg hover:bg-gray-100">📋 Đơn hàng</a>
            <a href="/dealer/inventory" className="block px-4 py-3 rounded-lg hover:bg-gray-100">📦 Kho hàng</a>
            <a href="/dealer/customers" className="block px-4 py-3 rounded-lg hover:bg-gray-100">👥 Khách hàng</a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}