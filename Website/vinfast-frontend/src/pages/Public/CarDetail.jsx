import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Layout/Navbar';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // State lưu trữ các lựa chọn của người dùng
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

  const getOptionsByType = (type) => {
    const allOptions = car?.options || car?.Options; 
    if (!allOptions) return [];

    return allOptions.filter(opt => 
      (opt.loaiTuyChon || opt.LoaiTuyChon)?.toLowerCase() === type.toLowerCase()
    );
  };

  const calculatePrice = async () => {
    if (!selected.phienBanId || !selected.mauNgoaiThat || !selected.mauNoiThat || !selected.loaiPin || !selected.loaiNoiThat) {
      alert('Vui lòng chọn đầy đủ các thông tin cấu hình');
      return;
    }

    setCalculating(true);
    try {
      // SỬA TẠI ĐÂY: Đảm bảo các ID là số trước khi gửi lên API tính giá
      const res = await api.post('/cars/config/calculate', {
        xeId: Number(id),
        phienBanId: Number(selected.phienBanId),
        mauNgoaiThat: selected.mauNgoaiThat,
        mauNoiThat: selected.mauNoiThat,
        loaiPin: selected.loaiPin,
        loaiNoiThat: selected.loaiNoiThat
      });
      setPrice(res.data);
    } catch (err) {
      alert('Không thể tính giá cấu hình. Vui lòng thử lại.');
    } finally {
      setCalculating(false);
    }
  };

  const addToCart = async () => {
  if (!price) return;
  try {
    // Đưa cả XeId vào trong cấu hình JSON
    const configToSend = {
      XeId: Number(id), // Thêm dòng này
      PhienBanId: Number(selected.phienBanId),
      MauNgoaiThat: selected.mauNgoaiThat,
      MauNoiThat: selected.mauNoiThat,
      LoaiPin: selected.loaiPin,
      LoaiNoiThat: selected.loaiNoiThat
    };

    const payload = {
      xeId: Number(id),
      cauHinhXeJson: JSON.stringify(configToSend), 
      gia: price.tongGia 
    };

    console.log("Payload gửi đi:", payload); // Log để bạn kiểm tra lần cuối

    await api.post('/cart/add', payload);

    alert('✅ Đã thêm vào giỏ hàng thành công!');
    navigate('/customer/cart');
  } catch (err) {
    console.error("Chi tiết lỗi:", err.response?.data);
    alert('Thêm vào giỏ thất bại: ' + (err.response?.data?.message || 'Lỗi hệ thống'));
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
          <div className="space-y-8">
            <div className="sticky top-24">

<img
  src={car.duongDanHinhAnhChinh || (car.hinhAnh && car.hinhAnh[0]?.duongDanHinhAnh) || "https://vfast.vn/wp-content/uploads/2021/04/vinfast-logo.png"}
  className="w-full rounded-3xl shadow-2xl object-cover"
  alt={car.mauXe}
/>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Tùy chỉnh cấu hình xe điện</h2>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">1. Chọn Phiên bản</label>
              <select
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-blue-300 outline-none transition-all"
                value={selected.phienBanId}
                onChange={e => {
                   setSelected({ ...selected, phienBanId: e.target.value });
                   setPrice(null); // Reset giá khi thay đổi cấu hình để bắt người dùng tính lại
                }}
              >
                <option value="">-- Chọn phiên bản --</option>
                {car.phienBan?.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.tenPhienBan} (Giá gốc: {v.giaCoBan.toLocaleString()} ₫)
                  </option>
                ))}
              </select>
            </div>

            {/* Render các Select Options động */}
            {[
              { label: '2. Màu ngoại thất', key: 'mauNgoaiThat', dbType: 'exterior_color' },
              { label: '3. Màu nội thất', key: 'mauNoiThat', dbType: 'interior_color' },
              { label: '4. Loại Pin', key: 'loaiPin', dbType: 'battery_type' },
              { label: '5. Loại nội thất', key: 'loaiNoiThat', dbType: 'interior_type' },
            ].map((item) => (
              <div className="space-y-4" key={item.key}>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">{item.label}</label>
                <select
                  className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg focus:border-blue-300 outline-none transition-all"
                  value={selected[item.key]}
                  onChange={e => {
                    setSelected({ ...selected, [item.key]: e.target.value });
                    setPrice(null); // Reset giá khi thay đổi cấu hình
                  }}
                >
                  <option value="">-- Chọn {item.label.split('. ')[1]} --</option>
                  {getOptionsByType(item.dbType).map(opt => {
                    // SỬA TẠI ĐÂY: Hỗ trợ cả 2 cách viết CamelCase và PascalCase cho Option
                    const ten = opt.tenTuyChon || opt.TenTuyChon;
                    const giaExtra = opt.anhHuongDenGia ?? opt.AnhHuongDenGia ?? 0;

                    return (
                      <option key={opt.id || opt.Id} value={ten}>
                        {ten} {giaExtra > 0 ? `(+${giaExtra.toLocaleString()} ₫)` : '(Miễn phí)'}
                      </option>
                    );
                  })}
                </select>
              </div>
            ))}

            <button
              onClick={calculatePrice}
              disabled={calculating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-70"
            >
              {calculating ? 'Đang tính toán giá...' : 'Xác nhận cấu hình & Tính giá'}
            </button>

            {price && (
              <div className="bg-blue-50 border-2 border-blue-100 p-8 rounded-3xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Giá cơ bản:</span>
                    <span className="font-bold">{(price.giaCoBan || 0).toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Phí tùy chọn:</span>
                    <span className="font-bold text-green-600">+{(price.phiOption || 0).toLocaleString()} ₫</span>
                </div>
                <hr className="border-blue-200 mb-4" />
                <p className="text-gray-600 text-xs uppercase font-bold">Tổng chi phí dự tính</p>
                <p className="text-4xl font-black text-blue-700 my-2">
                  {(price.tongGia || 0).toLocaleString()} ₫
                </p>
                <button
                  onClick={addToCart}
                  className="w-full mt-4 bg-orange-500 text-white py-5 rounded-2xl text-xl font-bold hover:bg-orange-600 transition-all active:scale-95 shadow-lg"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}