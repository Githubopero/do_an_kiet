import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Layout/Navbar';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState({
    phienBanId: '',
    mauNgoaiThat: '',
    mauNoiThat: '',
    loaiPin: '',
    loaiNoiThat: ''
  });

  const [price, setPrice] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const calculatePrice = async () => {
    if (!selected.phienBanId || !selected.mauNgoaiThat || !selected.mauNoiThat || !selected.loaiPin || !selected.loaiNoiThat) {
      alert('Vui lòng chọn đầy đủ các thông tin cấu hình');
      return;
    }

    setCalculating(true);
    try {
      const res = await api.post('/cars/config/calculate', {
        xeId: parseInt(id),
        phienBanId: parseInt(selected.phienBanId),
        mauNgoaiThat: selected.mauNgoaiThat,
        mauNoiThat: selected.mauNoiThat,
        loaiPin: selected.loaiPin,
        loaiNoiThat: selected.loaiNoiThat
      });
      setPrice(res.data);
    } catch (err) {
      alert('Không thể tính giá cấu hình.');
    } finally {
      setCalculating(false);
    }
  };

  const addToCart = async () => {
    if (!price) return;
    try {
      await api.post('/cart/add', {
        xeId: parseInt(id),
        cauHinhXeJson: JSON.stringify(selected),
        gia: price.tongGia
      });
      alert('✅ Đã thêm vào giỏ hàng!');
      navigate('/customer/cart');
    } catch (err) {
      alert('Thêm vào giỏ thất bại!');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Đang tải thông tin xe...</div>;
  if (!car) return <div className="text-center py-20 text-red-500">Không tìm thấy xe</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-900">{car.mauXe}</h1>
        <p className="text-gray-600 mb-8 text-xl italic">{car.moTa}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* CỘT TRÁI: HÌNH ẢNH & THÔNG TIN CHI TIẾT */}
          <div className="space-y-8">
            <div className="sticky top-24"> {/* Giữ ảnh cố định khi scroll bên phải */}
              <img
                src={car.hinhAnh?.[0]?.duongDanHinhAnh || "https://via.placeholder.com/800x500?text=VinFast"}
                className="w-full rounded-3xl shadow-2xl object-cover"
                alt={car.mauXe}
              />
              
              
            </div>
          </div>

          {/* CỘT PHẢI: CẤU HÌNH (GIỮ NGUYÊN) */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Tùy chỉnh cấu hình</h2>

            {/* Chọn phiên bản */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">1. Chọn Phiên bản</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-orange-300 outline-none transition-all"
                value={selected.phienBanId}
                onChange={e => setSelected({ ...selected, phienBanId: e.target.value })}
              >
                <option value="">Chọn phiên bản</option>
                {car.phienBan?.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.tenPhienBan} - {v.giaCoBan.toLocaleString()} ₫
                  </option>
                ))}
              </select>
            </div>

            {/* Màu ngoại thất */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">2. Màu ngoại thất</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-orange-300 outline-none transition-all"
                value={selected.mauNgoaiThat}
                onChange={e => setSelected({ ...selected, mauNgoaiThat: e.target.value })}
              >
                <option value="">Chọn màu ngoại thất</option>
                {[...new Set(car.cauHinhCoSan?.map(c => c.mauNgoaiThat))].map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Màu nội thất */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">3. Màu nội thất</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-orange-300 outline-none transition-all"
                value={selected.mauNoiThat}
                onChange={e => setSelected({ ...selected, mauNoiThat: e.target.value })}
              >
                <option value="">Chọn màu nội thất</option>
                {[...new Set(car.cauHinhCoSan?.map(c => c.mauNoiThat))].map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Loại pin */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">4. Loại pin</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-orange-300 outline-none transition-all"
                value={selected.loaiPin}
                onChange={e => setSelected({ ...selected, loaiPin: e.target.value })}
              >
                <option value="">Chọn loại pin</option>
                {[...new Set(car.cauHinhCoSan?.map(c => c.loaiPin))].map(pin => (
                  <option key={pin} value={pin}>{pin}</option>
                ))}
              </select>
            </div>

            {/* Loại nội thất */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">5. Loại nội thất</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-orange-300 outline-none transition-all"
                value={selected.loaiNoiThat}
                onChange={e => setSelected({ ...selected, loaiNoiThat: e.target.value })}
              >
                <option value="">Chọn loại nội thất</option>
                {[...new Set(car.cauHinhCoSan?.map(c => c.loaiNoiThat))].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Nút tính giá */}
            <button
              onClick={calculatePrice}
              disabled={calculating}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-orange-200 transition-all disabled:opacity-70"
            >
              {calculating ? 'Đang tính toán...' : 'Xem giá chính xác'}
            </button>

            {/* Kết quả giá & Giỏ hàng */}
            {price && (
              <div className="bg-orange-50 border-2 border-orange-100 p-8 rounded-3xl animate-fade-in-up">
                <p className="text-gray-600 text-sm uppercase tracking-widest font-bold">Tổng chi phí dự tính</p>
                <p className="text-4xl font-black text-orange-600 my-4">
                  {price.tongGia.toLocaleString()} ₫
                </p>
                <button
                  onClick={addToCart}
                  className="w-full bg-orange-400 text-black py-5 rounded-2xl text-xl font-bold hover:bg-orange-400 transition-all active:scale-95"
                >
                  Thêm vào giỏ hàng ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}