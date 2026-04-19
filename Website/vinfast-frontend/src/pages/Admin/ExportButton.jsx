import api from '../../services/api';

export default function ExportButton() {
  const handleExport = async () => {
    try {
      const res = await api.get('/admin/orders/export', { 
        responseType: 'blob' 
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DonHang_VinFast_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('✅ Xuất file Excel thành công!');
    } catch (err) {
      alert('Xuất Excel thất bại!');
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-orange-300 hover:bg-orange-400 text-black px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 mb-6"
    >
      Export danh sách đơn hàng
    </button>
  );
}