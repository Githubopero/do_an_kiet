import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [newUser, setNewUser] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '', confirmPassword: '', vaiTro: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // State quản lý User đang được sửa

  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter(user => 
  user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || 
  user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (user.soDienThoai && user.soDienThoai.includes(searchTerm))
);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      // Sắp xếp ID giảm dần (người mới lên đầu)
      const sortedData = res.data.sort((a, b) => b.id - a.id);
      setUsers(sortedData);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }
  };

  // --- LOGIC KIỂM TRA DỮ LIỆU (VALIDATION) ---
  const validateForm = () => {
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơỨỪỮỰÝỲỶỸỵýỳỷỹưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!nameRegex.test(newUser.hoTen) || newUser.hoTen.trim().split(/\s+/).length < 2) {
      alert("Họ tên phải là tiếng Việt có dấu và đầy đủ Họ và Tên.");
      return false;
    }
    if (!emailRegex.test(newUser.email)) {
      alert("Email không đúng định dạng (ví dụ: abc@gmail.com).");
      return false;
    }
    if (!phoneRegex.test(newUser.soDienThoai)) {
      alert("Số điện thoại VN không hợp lệ (10 số, bắt đầu 03, 05, 07, 08, 09).");
      return false;
    }
    if (newUser.matKhau !== newUser.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return false;
    }
    if (!passwordRegex.test(newUser.matKhau)) {
      alert("Mật khẩu phải từ 6 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.");
      return false;
    }
    return true;
  };

  // Logic Thêm người dùng
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Loại bỏ confirmPassword trước khi gửi lên Backend
      const { confirmPassword, ...dataToSubmit } = newUser;
      const res = await api.post('/admin/users', dataToSubmit);
      alert("Thêm người dùng thành công!");
      setNewUser({ hoTen: '', email: '', soDienThoai: '', matKhau: '', confirmPassword: '', vaiTro: 'Customer' });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) { // Hiển thị lỗi từ throw new Exception(...) ở Backend
      const errorMsg = err.response?.data?.message || "Lỗi khi thêm người dùng. Email/SĐT có thể đã tồn tại.";
      alert("Thất bại: " + errorMsg); 
    }
  };


  // --- HÀM MỚI: XỬ LÝ CẬP NHẬT THÔNG TIN ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // 1. Regex kiểm tra
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơỨỪỮỰÝỲỶỸỵýỳỷỹưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

    // 2. Kiểm tra Họ tên
    if (!nameRegex.test(editingUser.hoTen)) {
      alert("Họ tên không được chứa số hoặc ký tự đặc biệt.");
      return;
    }
    if (editingUser.hoTen.trim().split(/\s+/).length < 2) {
      alert("Vui lòng nhập đầy đủ cả Họ và tên.");
      return;
    }
    if (!phoneRegex.test(editingUser.soDienThoai)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    try {
      await api.put(`/admin/users/${editingUser.id}`, {
        hoTen: editingUser.hoTen,
        soDienThoai: editingUser.soDienThoai
      });
      alert("Cập nhật thông tin thành công!");
      setEditingUser(null); // Đóng modal
      fetchUsers(); // Tải lại danh sách
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  // Logic Xóa người dùng
  const deleteUser = async (id,vaiTro) => {
    if (vaiTro === 'Admin') {
      alert("Không thể xóa tài khoản Admin hệ thống!");
      return;
    }
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác!")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      alert("Đã xóa người dùng thành công");
    } catch (err) { alert("Không thể xóa người dùng này!"); }
  };

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setUsers([...users].sort((a, b) => newOrder === 'desc' ? b.id - a.id : a.id - b.id));
  };

  const updateRole = async (id, role) => {
    if (role === 'Admin' || !window.confirm(`Xác nhận đổi vai trò thành ${role}?`)) return;
    try {
      await api.put(`/admin/users/${id}/role`, role);
      alert('Cập nhật vai trò thành công!');
      setUsers(users.map(u => u.id === id ? { ...u, vaiTro: role } : u));
    } catch (error) {
      alert('Lỗi cập nhật vai trò!');
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Xác nhận thay đổi trạng thái thành ${status}?`)) return;
    try {
      // Lưu ý: Kiểm tra endpoint chuẩn của backend cho việc cập nhật trạng thái
      await api.put(`/admin/users/${id}/status`, status); 
      alert('Cập nhật trạng thái thành công!');
      // Cập nhật đúng key 'trangThaiTaiKhoan'
      setUsers(users.map(u => u.id === id ? { ...u, trangThaiTaiKhoan: status } : u));
    } catch (error) {
      alert('Lỗi cập nhật trạng thái!');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản lý người dùng</h1>
      <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-300 text-black px-4 py-2 rounded-lg hover:bg-orange-400 font-bold transition-all"
        >
          {showAddForm ? "Hủy bỏ" : "+ Thêm người dùng"}
        </button>
      </div>


      {/* FORM THÊM NGƯỜI DÙNG CÓ VALIDATION */}
      {showAddForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm animate-fadeIn">
          <h3 className="text-lg font-bold mb-4 text-orange-600">Đăng ký người dùng mới</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" placeholder="Họ và tên" className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none" 
              value={newUser.hoTen} onChange={e => setNewUser({...newUser, hoTen: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Email" className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none" 
              value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" placeholder="Số điện thoại" className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none" 
              value={newUser.soDienThoai} onChange={e => setNewUser({...newUser, soDienThoai: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" placeholder="Mật khẩu" className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none" 
              value={newUser.matKhau} onChange={e => setNewUser({...newUser, matKhau: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
                <input type="password" placeholder="Nhập lại mật khẩu" className="p-2 border rounded-lg focus:ring-2 focus:ring-orange-300 outline-none" 
              value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select className="p-2 border rounded-lg bg-gray-50 font-semibold" value={newUser.vaiTro} onChange={e => setNewUser({...newUser, vaiTro: e.target.value})}>
              <option value="">-Chọn vai trò-</option>
              <option value="Customer">Customer</option>
              <option value="DealerStaff">DealerStaff</option>
            </select>
              </div>
            
            
            
            <button type="submit" className="md:col-span-3 bg-orange-500 text-black py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-lg">
              Xác nhận thêm người dùng
            </button>
          </form>
        </div>
      )}

      {/* THANH TÌM KIẾM */}
<div className="mb-6 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
  <div className="relative w-full max-w-md">
    <h2 className="text-lg font-bold mb-4 text-orange-500 flex items-center">
          <span className="mr-2"></span> Tìm kiếm người dùng
        </h2>
    {/* <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span> */}
    <input 
      type="text"
      placeholder="Tìm theo tên, email hoặc số điện thoại..."
      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  <div className="ml-4 text-sm text-gray-500 font-medium">
    Tìm thấy: <span className="text-orange-600">{filteredUsers.length}</span> người dùng
  </div>
</div>


      <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-orange-300 text-gray-800">
            <tr>
              <th className="p-4 text-left cursor-pointer hover:bg-orange-400 transition-all" onClick={toggleSort}>
                ID {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-4 text-left">Họ tên</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Số điện thoại</th>
              <th className="p-4 text-center">Vai trò</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const isAdmin = user.vaiTro === 'Admin';
              
              return (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">#{user.id}</td>
                  <td className="p-4 font-medium text-gray-900">{user.hoTen}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  
                  {/* Cột Số điện thoại: Hiện tại API chưa có trường này */}
                  <td className="p-4 text-gray-500 text-sm italic">
                    {user.soDienThoai || 'Chưa hỗ trợ'} 
                  </td>

                  {/* Cột Vai Trò */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      {isAdmin ? (
                        <span className="px-3 py-1 bg-orange-300 text-black rounded text-xs font-bold uppercase">
                          Admin
                        </span>
                      ) : (
                        <select 
                          value={user.vaiTro}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className={`border rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-200
                            ${user.vaiTro === 'DealerStaff' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700'}`}
                        >
                          <option value="Customer">Customer</option>
                          <option value="DealerStaff">DealerStaff</option>
                        </select>
                      )}
                    </div>
                  </td>

                  {/* Cột Trạng Thái - Sử dụng key trangThaiTaiKhoan */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <select 
                        value={user.trangThaiTaiKhoan}
                        onChange={(e) => updateStatus(user.id, e.target.value)}
                        className={`border rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:ring-2
                          ${user.trangThaiTaiKhoan === 'ACTIVE' 
                            ? 'bg-green-50 text-green-700 border-green-200 focus:ring-green-100' 
                            : 'bg-red-50 text-red-700 border-red-200 focus:ring-red-100'}`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="LOCKED">LOCKED</option>
                      </select>
                    </div>
                  </td>


                  <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                  {/* NÚT SỬA */}
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded-full"
                      title="Sửa thông tin"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  <button onClick={() => deleteUser(user.id, user.vaiTro)} className="text-red-400 hover:text-red-700 transition-colors " title="Xóa người dùng">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      {/* --- MODAL SỬA THÔNG TIN --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa người dùng</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                  value={editingUser.hoTen}
                  onChange={e => setEditingUser({...editingUser, hoTen: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                  value={editingUser.soDienThoai}
                  onChange={e => setEditingUser({...editingUser, soDienThoai: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}