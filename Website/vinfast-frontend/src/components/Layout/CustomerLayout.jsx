import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CustomerLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* 1. Lớp ảnh nền cố định (Fixed Background) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("https://vinfastauto.com/themes/custom/vinfast_int/images/hero-car-desktop.jpg")', // Thay bằng link ảnh của bạn
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Giữ ảnh đứng yên khi cuộn trang
          opacity: 0.15 // Độ mờ của ảnh (0.1 đến 0.2 là đẹp nhất để không bị rối mắt)
        }}
      ></div>


    <div className="min-h-screen bg-orange-50">
      
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </div>
      <Footer/>
    </div>
    </div>
  );
}