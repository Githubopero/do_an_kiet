import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarImageManagement() {
  const [images, setImages] = useState([]);
  const [cars, setCars] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // State cho Form
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    xeId: '',
    loaiAnh: 'gallery',
    thuTuSapXep: 0
  });

  useEffect(() => {
    loadImages();
    api.get('/admin/cars').then(res => setCars(res.data));
  }, []);

  const loadImages = () => {
    api.get('/admin/car-images').then(res => {
      const data = res.data.sort((a, b) => b.id - a.id);
      setImages(data);
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Hàm xử lý thêm mới (Dùng FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('xeId', form.xeId);
    formData.append('loaiAnh', form.loaiAnh);
    formData.append('thuTuSapXep', form.thuTuSapXep);
    if (file) formData.append('file', file);

    try {
      await api.post('/admin/car-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Tải ảnh lên thành công!');
      setShowAddForm(false);
      setFile(null);
      loadImages();
    } catch (err) {
      alert('Lỗi khi tải ảnh: ' + err.response?.data?.message || err.message);
    }
  };

  // Hàm xử lý cập nhật
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('xeId', editingImage.xeId);
    formData.append('loaiAnh', editingImage.loaiAnh);
    formData.append('thuTuSapXep', editingImage.thuTuSapXep);
    if (file) formData.append('file', file);

    try {
      await api.put(`/admin/car-images/${editingImage.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Cập nhật thành công!');
      setEditingImage(null);
      setFile(null);
      loadImages();
    } catch (err) {
      alert('Lỗi cập nhật');
    }
  };

  const deleteImage = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      await api.delete(`/admin/car-images/${id}`);
      loadImages();
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter(img => 
      img.mauXe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.loaiAnh?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý hình ảnh xe</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-400 text-black px-6 py-2 rounded-xl font-bold hover:bg-orange-500 transition shadow-md"
        >
          {showAddForm ? "Hủy" : "+ Thêm ảnh mới"}
        </button>
      </div>

      {/* Form thêm ảnh */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border-t-8 border-orange-300 animate-fadeIn">
          <h2 className="text-xl font-bold mb-6 text-orange-600">Tải lên hình ảnh mới</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Mẫu xe</label>
              <select className="border p-2.5 rounded-xl bg-gray-50" value={form.xeId} onChange={e => setForm({...form, xeId: e.target.value})} required>
                <option value="">-- Chọn xe --</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Loại ảnh</label>
              <select className="border p-2.5 rounded-xl" value={form.loaiAnh} onChange={e => setForm({...form, loaiAnh: e.target.value})}>
                <option value="main">Ảnh đại diện (Main)</option>
                <option value="gallery">Ảnh thư viện (Gallery)</option>
                <option value="video_thumbnail">Thumbnail Video</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Chọn file ảnh</label>
              <input type="file" onChange={handleFileChange} className="border p-2 rounded-xl" accept="image/*" required />
            </div>
            <button type="submit" className="lg:mt-6 bg-orange-400 text-black py-2 rounded-xl font-bold hover:bg-orange-500 transition">Tải lên</button>
          </form>
        </div>
      )}

      {/* Tìm kiếm */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <h2 className="text-orange-500 font-bold mb-2">Tìm kiếm ảnh theo xe</h2>
        <input 
          type="text" 
          placeholder="Tên xe..."
          className="w-full md:w-1/3 p-3 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-orange-300 text-black">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Hình ảnh</th>
              <th className="p-4 text-left">Mẫu xe</th>
              <th className="p-4 text-left">Phân loại</th>
              <th className="p-4 text-center">Thứ tự</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.map((img) => (
              <tr key={img.id} className="border-t hover:bg-orange-50 transition-colors">
                <td className="p-4 text-gray-500 font-mono">#{img.id}</td>
                <td className="p-4">
                  <img 
                    src={`http://localhost:5130${img.duongDanHinhAnh}`} 
                    alt="car" 
                    className="w-24 h-14 object-cover rounded-lg border shadow-sm"
                    onError={(e) => e.target.src = 'https://placehold.co/100x60?text=No+Image'}
                  />
                </td>
                <td className="p-4 font-bold text-blue-900">{img.mauXe}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${img.loaiAnh === 'main' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {img.loaiAnh.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-center">{img.thuTuSapXep}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => setEditingImage(img)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Sửa</button>
                    <button onClick={() => deleteImage(img.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Sửa */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Chỉnh sửa hình ảnh #{editingImage.id}</h2>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <img src={`http://localhost:5130${editingImage.duongDanHinhAnh}`} className="w-32 rounded-lg" alt="current" />
                <div>
                  <p className="text-sm font-bold">Ảnh hiện tại</p>
                  <p className="text-xs text-gray-500">Tải lên file mới nếu muốn thay đổi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1">Loại ảnh</label>
                  <select className="border p-2.5 rounded-xl" value={editingImage.loaiAnh} 
                    onChange={e => setEditingImage({...editingImage, loaiAnh: e.target.value})}>
                    <option value="main">Main</option>
                    <option value="gallery">Gallery</option>
                    <option value="video_thumbnail">Video Thumbnail</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1">Thứ tự sắp xếp</label>
                  <input type="number" className="border p-2.5 rounded-xl" value={editingImage.thuTuSapXep} 
                    onChange={e => setEditingImage({...editingImage, thuTuSapXep: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-1">Thay đổi file ảnh (Không bắt buộc)</label>
                <input type="file" onChange={handleFileChange} className="border p-2 rounded-xl" accept="image/*" />
              </div>
              <div className="flex space-x-3 mt-4">
                <button type="button" onClick={() => {setEditingImage(null); setFile(null);}} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}