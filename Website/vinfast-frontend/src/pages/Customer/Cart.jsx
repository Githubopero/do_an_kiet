import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Không thể tải giỏ hàng");
        setLoading(false);
      });
  }, []);

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.gia, 0);

  if (loading) return <p className="text-center py-10">Đang tải giỏ hàng...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <p className="text-xl text-gray-500">Giỏ hàng trống</p>
      ) : (
        <div className="space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow flex gap-6">
              {/* Ảnh xe */}
              <img 
                src={item.duongDanHinhAnh || "https://via.placeholder.com/150"} 
                alt={item.mauXe}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="font-bold text-xl">{item.mauXe}</h3>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mt-3">
                  <p><span className="text-gray-500">Phiên bản:</span> {item.phienBan}</p>
                  <p><span className="text-gray-500">Màu ngoại:</span> {item.mauNgoaiThat}</p>
                  <p><span className="text-gray-500">Màu nội:</span> {item.mauNoiThat}</p>
                  <p><span className="text-gray-500">Loại pin:</span> {item.loaiPin}</p>
                  <p><span className="text-gray-500">Nội thất:</span> {item.loaiNoiThat}</p>
                </div>

                <p className="text-2xl font-bold text-orange-500 mt-4">
                  {item.gia.toLocaleString()} ₫
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700 self-start mt-2"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between text-2xl font-bold">
            <span>Tổng tiền:</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>
          <button
            onClick={() => navigate('/customer/checkout')}
            className="w-full mt-6 bg-orange-300 text-black py-4 rounded-2xl text-xl font-semibold hover:bg-orange-400"
          >
            Tiến hành thanh toán
          </button>
        </div>
      )}
    </div>
  );
}