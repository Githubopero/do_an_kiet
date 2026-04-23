import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CompareCars() {
  const [allVersions, setAllVersions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['', '', '']); // Lưu ID của 3 cột
  const [compareData, setCompareData] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách tất cả phiên bản để đổ vào Dropdown
  useEffect(() => {
    api.get('/customer/compare-versions')
      .then(res => setAllVersions(res.data))
      .catch(err => console.error("Lỗi lấy danh sách xe:", err));
  }, []);

  // 2. Khi thay đổi lựa chọn ở bất kỳ cột nào
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
      // Gọi API lấy chi tiết xe đó (có thể tối ưu bằng cách gọi 1 lần ids=1,2,3 
      // nhưng gọi lẻ khi change sẽ mượt hơn về UX)
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
    <div className="max-w-7xl mx-auto p-6 my-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-blue-900 uppercase">So sánh các phiên bản xe</h1>
        <p className="text-gray-500 mt-2">Đối chiếu thông số kỹ thuật và giá bán giữa các dòng xe VinFast</p>
      </div>

      {/* BẢNG SO SÁNH */}
      <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-6 w-1/4 text-blue-900 font-bold uppercase text-sm">Thông số kỹ thuật</th>
              {[0, 1, 2].map((i) => (
                <th key={i} className="p-6 w-1/4 border-l border-gray-200">
                  <select 
                    className="w-full p-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 outline-none text-sm font-bold bg-white"
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
          
          <tbody>
            {/* Hàng Hình ảnh */}
            <tr>
              <td className="p-6 font-bold text-gray-400 uppercase text-xs">Hình ảnh</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 text-center">
                  {car ? (
                    <img src={car.hinhAnh} alt={car.tenMauXe} className="w-full h-40 object-contain hover:scale-110 transition-transform" />
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-300 italic text-sm">Chưa chọn xe</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Hàng Tên xe */}
            <tr className="bg-blue-50/30">
              <td className="p-6 font-bold text-gray-700">Mẫu xe & Phiên bản</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 font-black text-blue-800 uppercase">
                  {car ? `${car.tenMauXe} ${car.tenPhienBan}` : '---'}
                </td>
              ))}
            </tr>

            {/* Hàng Giá bán */}
            <tr>
              <td className="p-6 font-bold text-gray-700">Giá niêm yết</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 text-orange-600 font-bold text-xl">
                  {car ? formatVND(car.giaCoBan) : '---'}
                </td>
              ))}
            </tr>

            {/* Hàng Pin */}
            <tr className="bg-gray-50/50">
              <td className="p-6 font-bold text-gray-700">Dung lượng Pin</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 font-medium">
                  {car ? `${car.dungLuongPin} kWh` : '---'}
                </td>
              ))}
            </tr>

            {/* Hàng Quãng đường */}
            <tr>
              <td className="p-6 font-bold text-gray-700">Quãng đường di chuyển</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 font-medium">
                  {car ? `${car.quangDuongDiChuyen} km / 1 lần sạc` : '---'}
                </td>
              ))}
            </tr>

            {/* Hàng Số chỗ */}
            <tr className="bg-gray-50/50">
              <td className="p-6 font-bold text-gray-700">Số chỗ ngồi</td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100 font-medium">
                  {car ? `${car.soChoNgoi} chỗ` : '---'}
                </td>
              ))}
            </tr>

            {/* Hàng Nút hành động */}
            <tr>
              <td className="p-6"></td>
              {compareData.map((car, i) => (
                <td key={i} className="p-6 border-l border-gray-100">
                  {car && (
                    <button 
                       onClick={() => window.location.href = `/car/${car.xeId}`}
                       className="w-full py-3 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all uppercase tracking-widest"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400 italic">
        * Thông số kỹ thuật có thể thay đổi theo điều kiện thực tế và trang bị tùy chọn.
      </div>
    </div>
  );
}