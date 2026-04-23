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
  <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
    
    {/* CỘT TRÁI: FORM GỬI YÊU CẦU (Chiếm 2/5) */}
    <div className="lg:col-span-2 space-y-6">
      <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-6">
        <h2 className="text-2xl font-black text-blue-900 mb-6 uppercase pb-4 text-center border-b">
          Gửi yêu cầu tư vấn
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Họ tên</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A" 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all" 
                required 
                value={form.hoTen}
                onChange={e => setForm({...form, hoTen: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  placeholder="09xxx..." 
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none" 
                  required 
                  value={form.soDienThoai}
                  onChange={e => setForm({...form, soDienThoai: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Mức độ ưu tiên</label>
                <select 
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none" 
                  value={form.mucDoUuTien} 
                  onChange={e => setForm({...form, mucDoUuTien: e.target.value})}
                >
                  <option value="NORMAL">Bình thường</option>
                  <option value="HIGH">Ưu tiên cao</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none" 
              required 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Mẫu xe quan tâm</label>
            <select 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none" 
              value={form.mauXeQuanTam} 
              onChange={e => setForm({...form, mauXeQuanTam: e.target.value})}
            >
              <option value="">Chọn mẫu xe</option>
              <option value="VF 3">VF 3</option>
              <option value="VF 5">VF 5</option>
              <option value="VF 6">VF 6</option>
              <option value="VF 7">VF 7</option>
              <option value="VF 8">VF 8</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Nội dung tư vấn</label>
            <textarea 
              placeholder="Tôi cần tư vấn về trả góp..." 
              rows={4} 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none resize-none" 
              required 
              value={form.noiDung}
              onChange={e => setForm({...form, noiDung: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-4 rounded-2xl text-white font-black transition-all shadow-lg
              ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
          >
            {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU TƯ VẤN'}
          </button>
        </form>
      </section>
    </div>

    {/* CỘT PHẢI: DANH SÁCH LỊCH SỬ (Chiếm 3/5) */}
    <div className="lg:col-span-3 space-y-6">
      <h2 className="text-2xl font-black text-gray-800 uppercase flex items-center">
        <span className="mr-3 text-blue-600">●</span> Yêu cầu đã gửi của bạn
      </h2>
      
      {loadingList ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
          <div className="animate-pulse text-gray-400 font-bold">Đang tải lịch sử...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              Chưa có lịch sử tư vấn nào được ghi nhận.
            </div>
          ) : (
            consultations.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all flex justify-between items-center group">
                <div className="flex gap-5 items-center">
                  <div className="bg-blue-50 p-4 rounded-2xl text-center min-w-[80px]">
                    <div className="text-[10px] font-bold text-blue-400 uppercase">Mẫu xe</div>
                    <div className="text-xl font-black text-blue-700">{item.mauXeQuanTam}</div>
                  </div>
                  
                  <div className="max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-500">
                        {item.maTracking}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(item.thoiGianTao).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mt-1 line-clamp-2 leading-relaxed">
                      {item.noiDung}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm ${
                    item.trangThaiXyLy === 'New' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.trangThaiXyLy === 'New' ? 'Đang chờ' : item.trangThaiXyLy}
                  </span>
                  <div className="text-[10px] text-gray-300 mt-3 font-mono italic">
                    ID: #{item.id.toString().slice(-5)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  </div>
);
}