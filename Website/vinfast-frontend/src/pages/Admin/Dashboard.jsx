import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    topSellingCars: []
  });

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setDashboard(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Quản trị</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Tổng doanh thu</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {dashboard.totalRevenue.toLocaleString()} ₫
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Tổng đơn hàng</p>
          <p className="text-4xl font-bold mt-2">{dashboard.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Đơn chờ xử lý</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">{dashboard.pendingOrders}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Top xe bán chạy</h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-right">Số lượng bán</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.topSellingCars.map((car, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-4">{car.mauXe}</td>
                <td className="p-4 text-right font-bold">{car.soLuongBan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}