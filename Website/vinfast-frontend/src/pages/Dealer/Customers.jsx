import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/dealer/customers').then(res => setCustomers(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Khách hàng Đại lý</h1>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Họ tên</th>
              <th className="p-4 text-left">Số điện thoại</th>
              <th className="p-4 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.userId} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{customer.hoTen}</td>
                <td className="p-4">{customer.soDienThoai}</td>
                <td className="p-4">{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}