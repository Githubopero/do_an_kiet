import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(res => {
        setCar(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Đang tải thông tin xe...</div>;
  if (!car) return <div className="text-center py-20 text-red-500">Không tìm thấy xe</div>;

  return (
    
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">{car.mauXe}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <img 
            src={car.hinhAnh?.[0]?.duongDanHinhAnh || '/placeholder.jpg'} 
            alt={car.mauXe}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <p className="text-gray-700 text-lg">{car.moTa}</p>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-semibold text-xl mb-4">Các phiên bản</h3>
            {car.phienBan?.map(v => (
              <div key={v.id} className="flex justify-between py-3 border-b last:border-0">
                <span>{v.tenPhienBan}</span>
                <span className="font-bold">{v.giaCoBan.toLocaleString()} ₫</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.href = `/customer/cart`}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl text-xl font-semibold hover:bg-blue-700"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}