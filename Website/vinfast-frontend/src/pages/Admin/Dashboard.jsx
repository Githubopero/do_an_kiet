import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <span className="ml-3 text-gray-600 font-medium">Đang tải báo cáo...</span>
    </div>
  );

  if (!data) return (
    <div className="p-4 bg-red-50 text-red-500 rounded-lg border border-red-200">
      Lỗi tải dữ liệu Dashboard. Vui lòng thử lại sau.
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tiêu đề linh hoạt */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard quản trị</h1>
        {/* Nơi đặt ExportButton sau này sẽ không bị đè lên tiêu đề */}
        <div className="text-sm text-gray-500">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</div>
      </div>

      {/* Grid Stats: 1 cột trên mobile, 2 cột trên tablet, 3 cột trên desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mt-2">
            {data.totalRevenue?.toLocaleString()} <span className="text-lg">₫</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng đơn hàng</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            {data.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Đơn chờ xử lý</p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mt-2">
            {data.pendingOrders}
          </p>
        </div>
      </div>

      {/* Phần bảng: Tối ưu cuộn ngang cho mobile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Top xe bán chạy</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-orange-50">
              <tr>
                <th className="text-left p-4 text-orange-800 font-semibold">Mẫu xe</th>
                <th className="text-right p-4 text-orange-800 font-semibold">Số lượng bán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.topSellingCars.map((car, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-700 font-medium">{car.mauXe}</td>
                  <td className="p-4 text-right">
                    <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                      {car.soLuongBan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}