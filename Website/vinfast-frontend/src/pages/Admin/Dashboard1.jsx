import { useEffect, useState } from 'react';
import api from '../../services/api';
// import ExportButton from './ExportButton';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')           // Không truyền filter nếu không cần
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải báo cáo...</div>;
  if (!data) return <div className="text-red-500">Lỗi tải dashboard</div>;

  return (
    <div>
      {/* <ExportButton /> */}
      <h1 className="text-3xl font-bold mb-8">Dashboard quản trị</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Tổng doanh thu</p>
          <p className="text-4xl font-bold text-orange-500">{data.totalRevenue.toLocaleString()} ₫</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Tổng đơn hàng</p>
          <p className="text-4xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Đơn chờ xử lý</p>
          <p className="text-4xl font-bold text-orange-600">{data.pendingOrders}</p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Top xe bán chạy</h2>
        <table className="w-full">
          <thead className="bg-orange-300">
            <tr>
              <th className="text-left p-3">Mẫu xe</th>
              <th className="text-right p-3">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {data.topSellingCars.map((car, i) => (
              <tr key={i}>
                <td className="p-3">{car.mauXe}</td>
                <td className="p-3 text-right font-bold">{car.soLuongBan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}