import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.gia, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : cart.length === 0 ? (
        <p className="text-xl text-gray-500">Giỏ hàng trống</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-xl">{item.xe?.mauXe}</h3>
                  <p className="text-gray-600">{item.cauHinhXe}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {item.gia.toLocaleString()} ₫
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng tiền:</span>
              <span>{total.toLocaleString()} ₫</span>
            </div>
            <button
              onClick={() => navigate('/customer/checkout')}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}