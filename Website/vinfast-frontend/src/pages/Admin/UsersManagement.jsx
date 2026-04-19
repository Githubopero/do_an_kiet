import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, role);
    alert('Cập nhật vai trò thành công!');
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Quản lý người dùng</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-300">
            <tr>
              <th className="p-4 text-left">Họ tên</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Vai trò</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{user.hoTen}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {user.vaiTro}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <select 
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="border rounded px-4 py-2 text-sm"
                  >
                    <option value="Customer">Customer</option>
                    <option value="DealerStaff">DealerStaff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}