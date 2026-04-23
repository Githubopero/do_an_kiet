import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function BookAppointment() {
  const [customerInfo, setCustomerInfo] = useState({ hoTen: '', soDienThoai: '', email: '' });
  const [appointments, setAppointments] = useState([]); // Danh sách lịch hẹn
  const [formData, setFormData] = useState({
    daiLyId: '1',
    ngayGioHen: '',
    ghiChu: ''
  });
  const [loading, setLoading] = useState(false);
  // Hàm load dữ liệu
  const loadData = async () => {
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        api.get('/customer/profile'),
        api.get('/customer/my-appointments')
      ]);
      setCustomerInfo(profileRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    // 1. Lấy thông tin khách hàng để pre-fill
    api.get('/customer/profile').then(res => setCustomerInfo(res.data));
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/customer/appointments', formData);
      alert('Đặt lịch thành công! Đại lý sẽ sớm liên hệ xác nhận với quý khách');
      setFormData({ ...formData, ngayGioHen: '', ghiChu: '' }); // Reset form
      loadData(); // Load lại danh sách sau khi đặt thành công
      // Reset form hoặc chuyển hướng
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-600';
      case 'Completed': return 'bg-green-100 text-green-600';
      case 'Cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* CỘT TRÁI: FORM ĐẶT LỊCH (Chiếm 2/5) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-6">
          <h2 className="text-2xl font-black text-blue-900 mb-6 uppercase pb-4 text-center">Đặt lịch lái thử</h2>
          <h3 className="font-black text-blue-900 uppercase border-b text-center">Tại showroom Vinfast QO</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Thông tin khách hàng</p>
                <div className="font-bold text-gray-700">{customerInfo.hoTen}</div>
                <div className="text-sm text-gray-500">{customerInfo.soDienThoai}</div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Chọn ngày & giờ</label>
              <input 
                required
                type="datetime-local"
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all"
                value={formData.ngayGioHen}
                onChange={e => setFormData({...formData, ngayGioHen: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Ghi chú</label>
              <textarea 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none h-24 resize-none"
                placeholder="Tôi muốn lái thử dòng xe VF8 vào cuối tuần..."
                value={formData.ghiChu}
                onChange={e => setFormData({...formData, ghiChu: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-black transition-all
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
            >
              {loading ? 'ĐANG GỬI...' : 'XÁC NHẬN ĐẶT LỊCH'}
            </button>
          </form>
        </div>
      </div>

      {/* CỘT PHẢI: DANH SÁCH LỊCH HẸN (Chiếm 3/5) */}
      <div className="lg:col-span-3 space-y-6">
        <h2 className="text-2xl font-black text-gray-800 uppercase flex items-center">
            <span className="mr-3 text-blue-600">●</span> Lịch hẹn của bạn
        </h2>

        {appointments.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
            Bạn chưa có lịch hẹn nào được ghi nhận.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all flex justify-between items-center group">
                <div className="flex gap-5 items-center">
                    <div className="bg-orange-50 p-3 rounded-xl text-center min-w-[70px]">
                        <div className="text-[10px] font-bold text-orange-400 uppercase">Tháng {new Date(item.ngayGioHen).getMonth() + 1}</div>
                        <div className="text-xl font-black text-orange-600">{new Date(item.ngayGioHen).getDate()}</div>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-800">
                            {new Date(item.ngayGioHen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Ghi chú: {item.ghiChu || '---'}</div>
                    </div>
                </div>

                <div className="text-right">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm ${getStatusStyle(item.trangThai)}`}>
                    {item.trangThai}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-2 font-mono italic">Mã số: #{item.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}