import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [newUser, setNewUser] = useState({ hoTen: '', email: '', soDienThoai: '', matKhau: '', confirmPassword: '', vaiTro: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
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
      const sortedData = res.data.sort((a, b) => b.id - a.id);
      setUsers(sortedData);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err);
    }
  };

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
      alert("Email không đúng định dạng.");
      return false;
    }
    if (!phoneRegex.test(newUser.soDienThoai)) {
      alert("Số điện thoại VN không hợp lệ.");
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const { confirmPassword, ...dataToSubmit } = newUser;
      await api.post('/admin/users', dataToSubmit);
      alert("Thêm người dùng thành công!");
      setNewUser({ hoTen: '', email: '', soDienThoai: '', matKhau: '', confirmPassword: '', vaiTro: 'Customer' });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      alert("Thất bại: " + (err.response?.data?.message || "Lỗi khi thêm."));
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser.id}`, {
        hoTen: editingUser.hoTen,
        soDienThoai: editingUser.soDienThoai
      });
      alert("Cập nhật thông tin thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  const deleteUser = async (id, vaiTro) => {
    if (vaiTro === 'Admin') return alert("Không thể xóa tài khoản Admin!");
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      alert("Đã xóa thành công");
    } catch (err) { alert("Lỗi xóa người dùng!"); }
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
      alert('Thành công!');
      setUsers(users.map(u => u.id === id ? { ...u, vaiTro: role } : u));
    } catch (error) { alert('Lỗi cập nhật vai trò!'); }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Xác nhận đổi trạng thái thành ${status}?`)) return;
    try {
      await api.put(`/admin/users/${id}/status`, status);
      setUsers(users.map(u => u.id === id ? { ...u, trangThaiTaiKhoan: status } : u));
      alert('Thành công!');
    } catch (error) { alert('Lỗi cập nhật trạng thái!'); }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Quản lý người dùng</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? (
            "✕ Hủy bỏ"
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Thêm người dùng
            </>
          )}
        </button>
      </div>

      {/* FORM THÊM NGƯỜI DÙNG */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-6 text-orange-600 border-b border-orange-50 pb-2">Đăng ký người dùng mới</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Họ và tên', key: 'hoTen', type: 'text', placeholder: 'Nguyễn Văn A' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'abc@gmail.com' },
              { label: 'Số điện thoại', key: 'soDienThoai', type: 'tel', placeholder: '03xxxxxxxx' },
              { label: 'Mật khẩu', key: 'matKhau', type: 'password', placeholder: '••••••' },
              { label: 'Nhập lại mật khẩu', key: 'confirmPassword', type: 'password', placeholder: '••••••' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">{field.label}</label>
                <input 
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                  value={newUser[field.key]} 
                  onChange={e => setNewUser({...newUser, [field.key]: e.target.value})} 
                  required 
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Vai trò</label>
              <select 
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-orange-300"
                value={newUser.vaiTro} 
                onChange={e => setNewUser({...newUser, vaiTro: e.target.value})}
                required
              >
                <option value="">- Chọn -</option>
                <option value="Customer">Customer</option>
                <option value="DealerStaff">DealerStaff</option>
              </select>
            </div>
            <button type="submit" className="sm:col-span-2 lg:col-span-3 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-2">
              Xác nhận thêm người dùng
            </button>
          </form>
        </div>
      )}

      {/* THANH TÌM KIẾM */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-orange-50 rounded-xl text-orange-700 font-bold text-sm whitespace-nowrap">
          Tìm thấy: {filteredUsers.length} người dùng
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-orange-50 text-orange-800">
              <tr>
                <th className="p-4 cursor-pointer hover:bg-orange-100 transition-colors" onClick={toggleSort}>
                  ID {sortOrder === 'desc' ? '↓' : '↑'}
                </th>
                <th className="p-4">Thông tin cơ bản</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4 text-center">Vai trò</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => {
                const isAdmin = user.vaiTro === 'Admin';
                return (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{user.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{user.hoTen}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.soDienThoai || <span className="text-gray-300 italic">Trống</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {isAdmin ? (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest">Admin</span>
                        ) : (
                          <select 
                            value={user.vaiTro}
                            onChange={(e) => updateRole(user.id, e.target.value)}
                            className="text-xs font-bold border rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
                          >
                            <option value="Customer">Customer</option>
                            <option value="DealerStaff">DealerStaff</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <select 
                          value={user.trangThaiTaiKhoan}
                          onChange={(e) => updateStatus(user.id, e.target.value)}
                          className={`text-xs font-bold border rounded-lg px-2 py-1 outline-none transition-all ${
                            user.trangThaiTaiKhoan === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="LOCKED">LOCKED</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setEditingUser(user)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onClick={() => deleteUser(user.id, user.vaiTro)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SỬA */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="p-2 bg-orange-100 rounded-lg text-orange-600 italic">ID #{editingUser.id}</span>
              Chỉnh sửa
            </h2>
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Họ và tên</label>
                <input 
                  type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                  value={editingUser.hoTen} onChange={e => setEditingUser({...editingUser, hoTen: e.target.value})} required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Số điện thoại</label>
                <input 
                  type="tel" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                  value={editingUser.soDienThoai} onChange={e => setEditingUser({...editingUser, soDienThoai: e.target.value})} required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}