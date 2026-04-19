import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');

  useEffect(() => {
    api.get('/cars').then(res => {
      setCars(res.data);
      setFilteredCars(res.data);
    });
  }, []);

  const handleFilter = () => {
    let result = cars;

    if (keyword) {
      result = result.filter(c => 
        c.mauXe.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (minPrice) {
      result = result.filter(c => c.giaThapNhat >= parseFloat(minPrice));
    }

    setFilteredCars(result);
  };

  return (
    <div>
      
      <h1 className="text-3xl font-bold mb-6">Danh sách xe VinFast</h1>

      {/* Thanh tìm kiếm + lọc */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Tìm theo tên xe..."
          className="flex-1 border px-4 py-3 rounded-lg"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá từ (VND)"
          className="w-48 border px-4 py-3 rounded-lg"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <button
          onClick={handleFilter}
          className="bg-orange-300 text-black px-8 rounded-lg hover:bg-orange-400"
        >
          Lọc
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden">
            <img 
              src={car.duongDanHinhAnhChinh || "https://via.placeholder.com/600x400?text=VinFast"} 
              className="w-full h-52 object-cover"
              alt={car.mauXe}
            />
            <div className="p-5">
              <h3 className="font-bold text-2xl">{car.mauXe}</h3>
              <p className="text-3xl font-semibold text-orange-400 mt-2">
                {car.giaThapNhat.toLocaleString()} đ
              </p>
              <Link 
                to={`/car/${car.id}`}
                className="mt-6 block text-center bg-orange-300 hover:bg-orange-500 text-black py-3 rounded-xl font-medium"
              >
                Xem chi tiết và cấu hình
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}