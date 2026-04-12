import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Cars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get('/cars').then(res => setCars(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Danh sách xe VinFast</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map(car => (
          <div key={car.id} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
            <img src={car.duongDanHinhAnhChinh} className="w-full h-48 object-cover" alt={car.mauXe} />
            <div className="p-5">
              <h3 className="font-semibold text-xl">{car.mauXe}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{car.giaThapNhat.toLocaleString()} ₫</p>
              <Link to={`/car/${car.id}`} className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}