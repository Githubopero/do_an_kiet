import { useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Consultation() {
  const {user}=useAuth();//Lấy user từ context

  const [consultations, setConsultations] = useState([]); // Danh sách lịch sử
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [form, setForm] = useState({
    hoTen:'',
    soDienThoai: '',
    email: '',
    mauXeQuanTam: '',
    noiDung: '',
    mucDoUuTien: 'NORMAL',
    anhDinhKem: ''
  });


  // 1. Hàm lấy danh sách lịch sử
  const fetchHistory = async () => {
    try {
      const res = await api.get('/consultations/my-requests');
      setConsultations(res.data);
    } catch (err) {
      console.error("Không thể tải lịch sử tư vấn");
    } finally {
      setLoadingList(false);
    }
  };

// Dùng useEffect để điền thông tin khi user load xong
  useEffect(() => {
    console.log("Dữ liệu user lấy từ context:", user);
    if (user) {
      setForm(prevForm => ({
        ...prevForm,
        hoTen: user.hoTen || '',
        soDienThoai: user.soDienThoai || '',
        email: user.email || ''
      }));
      // QUAN TRỌNG: Phải gọi hàm này ở đây để lấy dữ liệu khi trang vừa load
    fetchHistory();
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/consultations', form);
      alert(`Gửi tư vấn thành công!\nMã theo dõi: ${res.data.maTracking}`);
      // Reset nội dung và mẫu xe sau khi gửi
      setForm(prev => ({ ...prev, noiDung: '', mauXeQuanTam: '' }));
      
      // Cập nhật lại danh sách lịch sử ngay lập tức
      fetchHistory();
    } catch (err) {
      alert('Gửi tư vấn thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <section className="bg-white p-8 rounded-3xl shadow-xl">
      <h1 className="text-3xl font-bold mb-8">Gửi yêu cầu tư vấn</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Họ tên" className="border p-4 rounded-2xl" required value={form.hoTen}
            onChange={e => setForm({...form, hoTen: e.target.value})} />
          <input type="tel" placeholder="Số điện thoại" className="border p-4 rounded-2xl" required value={form.soDienThoai}
            onChange={e => setForm({...form, soDienThoai: e.target.value})} />
        </div>

        <input type="email" placeholder="Email" className="border p-4 rounded-2xl w-full" required value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} />

        <select className="border p-4 rounded-2xl w-full" value={form.mauXeQuanTam} onChange={e => setForm({...form, mauXeQuanTam: e.target.value})}>
          <option value="">Chọn mẫu xe quan tâm</option>
          <option value="VF 3">VF 3</option>
          <option value="VF 5">VF 5</option>
          <option value="VF 6">VF 6</option>
          <option value="VF 7">VF 7</option>
          <option value="VF 8">VF 8</option>
        </select>

        <textarea placeholder="Nội dung tư vấn" rows={5} className="border p-4 rounded-2xl w-full" required value={form.noiDung}
          onChange={e => setForm({...form, noiDung: e.target.value})} />

        <div>
          <label className="block mb-2 font-medium">Mức độ ưu tiên</label>
          <select className="border p-4 rounded-2xl w-full" value={form.mucDoUuTien} onChange={e => setForm({...form, mucDoUuTien: e.target.value})}>
            <option value="NORMAL">Bình thường</option>
            <option value="HIGH">Ưu tiên cao</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-300 text-black py-4 rounded-2xl text-xl font-semibold hover:bg-orange-400">
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
        </button>
      </form>
      </section>


      {/* PHẦN 2: DANH SÁCH LỊCH SỬ */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-2"></span> Yêu cầu đã gửi của bạn
        </h2>
        
        {loadingList ? (
          <div className="text-center py-10">Đang tải lịch sử...</div>
        ) : (
          <div className="grid gap-4">
            {consultations.length === 0 ? (
              <div className="bg-gray-50 p-10 text-center rounded-2xl border-2 border-dashed">
                Chưa có lịch sử tư vấn.
              </div>
            ) : (
              consultations.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3">
                       <span className="font-bold text-lg">{item.mauXeQuanTam}</span>
                       <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{item.maTracking}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-1">{item.noiDung}</p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {new Date(item.thoiGianTao).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      item.trangThaiXyLy === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.trangThaiXyLy === 'New' ? 'Đang chờ' : item.trangThaiXyLy}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}