import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function CompareCars() {
  const [allVersions, setAllVersions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['', '', '']);
  const [compareData, setCompareData] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/customer/compare-versions')
      .then(res => setAllVersions(res.data))
      .catch(err => console.error("Lỗi lấy danh sách xe:", err));
  }, []);

  const handleSelectChange = async (index, id) => {
    const newIds = [...selectedIds];
    newIds[index] = id;
    setSelectedIds(newIds);

    if (!id) {
      const newData = [...compareData];
      newData[index] = null;
      setCompareData(newData);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/customer/compare-details?ids=${id}`);
      const newData = [...compareData];
      newData[index] = res.data[0]; 
      setCompareData(newData);
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-blue-900 uppercase tracking-tighter">
          So sánh các phiên bản xe
        </h1>
        <div className="flex justify-center">
            <div className="h-1.5 w-32 bg-orange-400 rounded-full"></div>
        </div>
        <p className="text-gray-500 font-medium italic max-w-2xl mx-auto">
          Đối chiếu thông số kỹ thuật và giá bán giữa các dòng xe điện VinFast để tìm ra lựa chọn tối ưu nhất cho bạn.
        </p>
      </div>

      {/* BẢNG SO SÁNH - Responsive Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 mx-auto max-w-7xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-8 w-1/4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thông số kỹ thuật</span>
                </th>
                {[0, 1, 2].map((i) => (
                  <th key={i} className="p-6 w-1/4 border-l border-gray-100 bg-blue-50/20">
                    <select 
                      className="w-full p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 outline-none text-sm font-black bg-white shadow-sm transition-all cursor-pointer"
                      value={selectedIds[i]}
                      onChange={(e) => handleSelectChange(i, e.target.value)}
                    >
                      <option value="">-- Chọn phiên bản --</option>
                      {allVersions.map(v => (
                        <option key={v.id} value={v.id}>{v.tenMauXe} - {v.tenPhienBan}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-50">
              {/* Hình ảnh */}
              <tr>
                <td className="p-8 font-black text-blue-900 uppercase text-xs tracking-widest bg-gray-50/30">Hình ảnh tiêu biểu</td>
                {compareData.map((car, i) => (
                  <td key={i} className="p-8 border-l border-gray-50 text-center group">
                    {car ? (
                      <img 
                        src={car.hinhAnh} 
                        alt={car.tenMauXe} 
                        className="w-full h-44 object-contain transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="h-44 flex flex-col items-center justify-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-300 transition-colors">
                        <svg className="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span className="italic text-xs font-bold uppercase tracking-widest">Trống</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Tên xe */}
              <tr className="bg-blue-900/5">
                <td className="p-8 font-black text-gray-700 uppercase text-xs tracking-widest">Dòng xe & Phiên bản</td>
                {compareData.map((car, i) => (
                  <td key={i} className="p-8 border-l border-gray-100 font-black text-blue-900 uppercase italic text-lg tracking-tighter">
                    {car ? `${car.tenMauXe} ${car.tenPhienBan}` : '---'}
                  </td>
                ))}
              </tr>

              {/* Giá bán */}
              <tr>
                <td className="p-8 font-black text-gray-700 uppercase text-xs tracking-widest">Giá niêm yết (VND)</td>
                {compareData.map((car, i) => (
                  <td key={i} className="p-8 border-l border-gray-100">
                    <span className="text-2xl font-black text-orange-500">
                        {car ? formatVND(car.giaCoBan).replace('₫', '') : '---'}
                    </span>
                    {car && <span className="text-xs font-bold text-orange-400 ml-1">VNĐ</span>}
                  </td>
                ))}
              </tr>

              {/* Thông số kỹ thuật chung */}
              {[
                { label: 'Dung lượng Pin', key: 'dungLuongPin', unit: 'kWh' },
                { label: 'Quãng đường (WLTP)', key: 'quangDuongDiChuyen', unit: 'km / sạc' },
                { label: 'Số chỗ ngồi', key: 'soChoNgoi', unit: 'chỗ' },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                  <td className="p-8 font-black text-gray-700 uppercase text-xs tracking-widest">{row.label}</td>
                  {compareData.map((car, i) => (
                    <td key={i} className="p-8 border-l border-gray-100 font-black text-gray-600">
                      {car ? `${car[row.key]} ${row.unit}` : '---'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Hàng Xem chi tiết */}
              <tr>
                <td className="p-8 bg-gray-50/30"></td>
                {compareData.map((car, i) => (
                  <td key={i} className="p-8 border-l border-gray-100">
                    {car && (
                      <Link 
                         to={`/car/${car.xeId}`}
                         className="block w-full py-4 bg-blue-900 text-white rounded-2xl text-[10px] font-black hover:bg-orange-400 hover:text-black transition-all uppercase tracking-[0.2em] text-center shadow-lg active:scale-95"
                      >
                        Chi tiết sản phẩm
                      </Link>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center px-6">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          * Thông số kỹ thuật chỉ mang tính chất tham khảo. <br className="md:hidden" /> 
          Vui lòng liên hệ Showroom gần nhất để biết thêm chi tiết.
        </p>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-orange-300 border-t-blue-900 rounded-full animate-spin mb-4"></div>
                <span className="font-black text-blue-900 uppercase text-xs tracking-[0.3em]">Đang đối chiếu...</span>
            </div>
        </div>
      )}
    </div>
  );
}