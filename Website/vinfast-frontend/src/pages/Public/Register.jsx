import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '' ,confirmPassword:''});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { hoTen, email, soDienThoai, matKhau, confirmPassword } = form;

    // --- 1. KIỂM TRA HỌ TÊN TIẾNG VIỆT ---
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơỨỪỮỰÝỲỶỸỵýỳỷỹưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/;


    if (!nameRegex.test(form.hoTen)) {
      alert("Họ tên không được chứa số hoặc ký tự đặc biệt.");
      return;
    }

    // Kiểm tra xem có ít nhất 2 từ (Họ và Tên) không (Tùy chọn)
    if (form.hoTen.trim().split(/\s+/).length < 2) {
      alert("Vui lòng nhập đầy đủ cả Họ và tên.");
      return;
    }

    // --- 1. KIỂM TRA EMAIL ---
    // Định dạng: abc@gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không đúng định dạng");
      return;
    }

    // --- 2. KIỂM TRA SỐ ĐIỆN THOẠI ---
    // Định dạng Việt Nam: 10 chữ số, bắt đầu bằng số 0
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(form.soDienThoai)) {
      alert("Số điện thoại không hợp lệ (Phải có 10 số và bắt đầu bằng đầu số VN như 03, 05, 09...)");
      return;
    }

    // 2. KIỂM TRA LOGIC: So sánh mật khẩu
    if (form.matKhau !== form.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return; // Dừng việc gửi form
    }

    // 2. Định nghĩa Regex kiểm tra độ phức tạp
    // Ít nhất: 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt, độ dài >= 6
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(form.matKhau)) {
      alert(
        "Mật khẩu phải có ít nhất 6 ký tự, bao gồm: " +
        "1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&)"
      );
      return;
    }

    if (hoTen.trim().length < 2) {
      alert("Vui lòng nhập đầy đủ họ tên.");
    return;
    }


    const { confirmPassword: _, ...dataToSubmit } = form; // Loại bỏ confirmPassword
    const res = await register(dataToSubmit);
    if (res.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">


      {/* Lớp nền ảnh có độ mờ */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://phucvietauto.com/wp-content/uploads/2023/03/bang-gia-xe-vinfast-moi-nhat-2023242526-1024x576.jpg")', // Thay link ảnh của bạn vào đây
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3 // Chỉnh độ mờ ở đây (từ 0 đến 1)
        }}
      ></div>


      <div className="z-10 bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Họ tên (Nguyễn Văn A)" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, hoTen: e.target.value})} required />
          <input type="email" placeholder="Email (example@email.com)" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, soDienThoai: e.target.value})} required />
          <input type="password" placeholder="Mật khẩu" className="w-full px-4 py-3 border rounded-lg" onChange={e => setForm({...form, matKhau: e.target.value})} required />
          {/* 3. Thêm input Nhập lại mật khẩu */}
      <input 
        type="password" 
        placeholder="Nhập lại mật khẩu" 
        className="w-full px-4 py-3 border rounded-lg" 
        onChange={e => setForm({...form, confirmPassword: e.target.value})} 
        required 
      />
          <button type="submit" className="w-full bg-orange-300 text-black py-3 rounded-lg font-medium hover:bg-orange-400">Đăng ký</button>
        </form>
        <p className="text-center mt-6">
          Đã có tài khoản? <Link to="/login" className="text-orange-600 font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}