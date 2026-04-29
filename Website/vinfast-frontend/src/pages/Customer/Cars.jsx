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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight uppercase">
          Danh sách xe VinFast
        </h1>
        <div className="h-1.5 w-24 bg-orange-400 rounded-full"></div>
      </div>

      {/* Thanh tìm kiếm + lọc - Responsive */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Tên xe</label>
          <input
            type="text"
            placeholder="Tìm theo tên xe (Vf8, Vf9...)"
            className="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 font-medium transition-all"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Giá tối thiểu (VND)</label>
          <input
            type="number"
            placeholder="Giá từ..."
            className="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 font-medium transition-all"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </div>
        <button
          onClick={handleFilter}
          className="w-full md:w-auto bg-orange-300 text-black px-10 py-3 rounded-2xl font-black uppercase text-sm hover:bg-orange-400 transition-all shadow-lg shadow-orange-100 active:scale-95"
        >
          Lọc
        </button>
      </div>

      {/* Danh sách xe - Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCars.map(car => (
          <div 
            key={car.id} 
            className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-50 group"
          >
            {/* Hình ảnh xe */}
            <div className="relative overflow-hidden h-56">
              <img 
                src={car.duongDanHinhAnhChinh || "https://via.placeholder.com/600x400?text=VinFast"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={car.mauXe}
              />
              <div className="absolute top-4 right-4">
                {/* <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-blue-900 uppercase">
                  Sẵn có
                </span> */}
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-6">
              <h3 className="font-black text-2xl text-blue-900 uppercase tracking-tighter italic">
                {car.mauXe}
              </h3>
              
              <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Giá ưu đãi</p>
                <p className="text-2xl font-black text-gray-800">
                   {car.giaThapNhat.toLocaleString()} <span className="text-sm">đ</span>
                </p>
              </div>

              <Link 
                to={`/car/${car.id}`}
                className="mt-6 block text-center bg-orange-300 hover:bg-black hover:text-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-md active:scale-95"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-black uppercase tracking-[0.2em]">Không tìm thấy mẫu xe phù hợp</p>
        </div>
      )}
    </div>
  );
}