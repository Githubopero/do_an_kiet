import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Ô tô điện VinFast</h3>
            <p className="text-gray-500 text-sm">
              Hệ thống quản lý mua bán xe hàng đầu, kết nối đại lý và khách hàng một cách nhanh chóng.
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Liên kết</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-blue-600">Trang chủ</Link></li>
              <li><Link to="/customer/cars" className="hover:text-blue-600">Danh sách xe</Link></li>
              <li><Link to="/login" className="hover:text-blue-600">Đăng nhập</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-600">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>📍 123 Đường ABC, Hà Nội</li>
              <li>📞 Hotline: 1900 1234</li>
              <li>✉️ Email: support@cardealer.com</li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} Ô tô điện VinFast. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}