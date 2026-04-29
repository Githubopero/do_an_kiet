import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';

export default function CarImageManagement() {
  const [images, setImages] = useState([]);
  const [cars, setCars] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.xeId) return alert("Vui lòng chọn xe");
    
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
      setForm({ xeId: '', loaiAnh: 'gallery', thuTuSapXep: 0 });
      loadImages();
    } catch (err) {
      alert('Lỗi khi tải ảnh: ' + (err.response?.data?.message || err.message));
    }
  };

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
      try {
        await api.delete(`/admin/car-images/${id}`);
        loadImages();
      } catch (err) {
        alert("Lỗi khi xóa ảnh");
      }
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter(img => 
      img.mauXe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.loaiAnh?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Quản lý hình ảnh xe</h1>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFile(null);
          }}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            showAddForm ? "bg-gray-100 text-gray-600" : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {showAddForm ? "✕ Hủy bỏ" : "+ Thêm ảnh mới"}
        </button>
      </div>

      {/* Form thêm ảnh */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-md animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-4 text-orange-600 border-b border-orange-50 pb-2">Tải lên hình ảnh mới</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Mẫu xe</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-300"
                  value={form.xeId} 
                  onChange={e => setForm({...form, xeId: e.target.value})} 
                  required
                >
                  <option value="">-- Chọn xe --</option>
                  {cars.map(c => <option key={c.id} value={c.id}>{c.mauXe}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Loại ảnh</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300"
                  value={form.loaiAnh} 
                  onChange={e => setForm({...form, loaiAnh: e.target.value})}
                >
                  <option value="main">Ảnh đại diện (Main)</option>
                  <option value="gallery">Ảnh thư viện (Gallery)</option>
                  <option value="video_thumbnail">Thumbnail Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Chọn file ảnh</label>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  accept="image/*" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Thứ tự</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300"
                  value={form.thuTuSapXep} 
                  onChange={e => setForm({...form, thuTuSapXep: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
              Bắt đầu tải lên
            </button>
          </form>
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên mẫu xe hoặc loại ảnh..."
            className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-orange-50 rounded-xl text-orange-700 font-bold text-sm text-center">
          Tìm thấy: {filteredImages.length} ảnh
        </div>
      </div>

      {/* Danh sách hình ảnh */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-orange-50 text-orange-800 font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4 text-center">Hình ảnh</th>
                <th className="p-4">Mẫu xe</th>
                <th className="p-4">Phân loại</th>
                <th className="p-4 text-center">Thứ tự</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredImages.map((img) => (
                <tr key={img.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-xs">#{img.id}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <img 
                        src={`http://localhost:5130${img.duongDanHinhAnh}`} 
                        alt="car" 
                        className="w-24 h-16 object-cover rounded-xl border border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-zoom-in"
                        onError={(e) => e.target.src = 'https://placehold.co/100x60?text=No+Image'}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{img.mauXe}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                      img.loaiAnh === 'main' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : img.loaiAnh === 'video_thumbnail'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {img.loaiAnh}
                    </span>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-600">{img.thuTuSapXep}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => setEditingImage(img)} 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa ảnh"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => deleteImage(img.id)} 
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Xóa ảnh"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chỉnh sửa */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Chỉnh sửa hình ảnh #{editingImage.id}</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <img 
                  src={`http://localhost:5130${editingImage.duongDanHinhAnh}`} 
                  className="w-32 h-20 object-cover rounded-xl shadow-md border-2 border-white" 
                  alt="current" 
                />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-widest">Ảnh hiện tại</p>
                  <p className="text-xs text-gray-500 mt-1 italic">Tải tệp mới bên dưới nếu muốn thay đổi file ảnh</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">Loại ảnh</label>
                  <select 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                    value={editingImage.loaiAnh} 
                    onChange={e => setEditingImage({...editingImage, loaiAnh: e.target.value})}
                  >
                    <option value="main">Main</option>
                    <option value="gallery">Gallery</option>
                    <option value="video_thumbnail">Video Thumbnail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">Thứ tự sắp xếp</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none transition-all"
                    value={editingImage.thuTuSapXep} 
                    onChange={e => setEditingImage({...editingImage, thuTuSapXep: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Thay thế bằng file mới (Tùy chọn)</label>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  accept="image/*" 
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => {setEditingImage(null); setFile(null);}} 
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}