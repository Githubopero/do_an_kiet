import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Trong khi đang khôi phục user từ localStorage, hiển thị màn hình chờ
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mt-4 text-gray-600 font-medium">Đang xác thực quyền truy cập...</span>
      </div>
    );
  }

  // Debug để kiểm tra (Xóa sau khi đã chạy ổn định)
  console.log("--- Kiểm tra quyền ---");
  console.log("User:", user);
  console.log("Vai trò hiện tại:", user?.vai_tro || user?.vaiTro);
  console.log("Quyền yêu cầu:", allowedRoles);

  // 2. Kiểm tra nếu không có user hoặc user là object rỗng
  const isAuthenticated = user && Object.keys(user).length > 0;

  if (!isAuthenticated) {
    console.warn("Chưa đăng nhập, chuyển hướng về Login");
    // Lưu lại location để sau khi login xong có thể quay lại đúng trang này
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra Role
  // Lưu ý: SQL của bạn dùng 'vai_tro'. Hãy đảm bảo key này khớp với dữ liệu API trả về.
  const userRole = user.vai_tro || user.vaiTro; 
  const hasRole = allowedRoles ? allowedRoles.includes(userRole) : true;

  if (!hasRole) {
    console.error(`Truy cập bị từ chối. Cần [${allowedRoles}], nhưng user có [${userRole}]`);
    // Nếu đã đăng nhập nhưng sai quyền, về trang chủ (hoặc trang 403)
    alert("Bạn không có quyền truy cập vào khu vực này!");
    return <Navigate to="/" replace />; 
  }

  // 4. Nếu mọi thứ ổn, cho phép vào trang
  return children;
}