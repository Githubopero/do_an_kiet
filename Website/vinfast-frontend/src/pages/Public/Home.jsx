import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            VinFast - Tương Lai Của Di Chuyển
          </h1>
          <p className="text-2xl text-gray-600">Chọn xe điện thông minh của bạn ngay hôm nay</p>
        </div>

        <div className="flex justify-center gap-6">
          <Link
            to="/customer"
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700 transition"
          >
            Mua xe ngay
          </Link>
          <Link
            to="/login"
            className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-2xl text-xl font-semibold hover:bg-blue-50 transition"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}