import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';


export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Thêm logic tạo đơn hàng trước khi sang trang checkout
const handleCheckout = async () => {
  try {
    // Gọi API để chuyển cart thành đơn hàng (tùy thuộc vào Backend của bạn)
    const response = await api.post('/orders/create-from-cart',{}); 
    const newOrder = response.data;
    
    // Chuyển sang trang checkout kèm theo orderId
    navigate(`/customer/checkout?orderId=${newOrder.id}`);
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Không thể tạo đơn hàng. Vui lòng thử lại!");
  }
};
// const updateQuantity = async (id, newQuantity) => {
//   if (newQuantity < 1) return; // Không cho phép giảm xuống 0

//   try {
//     // Giả sử API của bạn là PUT /cart/{id} và nhận vào quantity
//     await api.put(`/cart/${id}`, { soLuong: newQuantity });
    
//     // Cập nhật lại state cục bộ để UI thay đổi ngay lập tức
//     setCart(cart.map(item => 
//       item.id === id ? { ...item, soLuong: newQuantity } : item
//     ));
//   } catch (err) {
//     alert("Không thể cập nhật số lượng");
//   }
// };

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Không thể tải giỏ hàng");
        setLoading(false);
      });
  }, []);

  const removeItem = async (id) => {
    if (window.confirm('Xóa mẫu xe này khỏi giỏ hàng?')) {
      try {
        await api.delete(`/cart/${id}`);
        setCart(cart.filter(item => item.id !== id));
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm");
      }
    }
  };

  const total = cart.reduce((sum, item) => sum + item.gia, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="mt-4 font-black uppercase tracking-widest text-gray-400">Đang kiểm tra giỏ hàng...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 bg-rose-50 rounded-[2.5rem] border border-rose-100">
      <p className="text-rose-600 font-black uppercase">{error}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-blue-900 uppercase tracking-tighter">Giỏ hàng của bạn</h1>
          <p className="text-gray-500 font-medium italic mt-2">Các mẫu xe VinFast bạn đã tùy chỉnh cấu hình</p>
        </div>
        <div className="bg-blue-50 px-6 py-2 rounded-2xl border border-blue-100">
          <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Số lượng: {cart.length} xe</span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-black uppercase tracking-widest mb-6">Giỏ hàng đang trống</p>
          <button 
            onClick={() => navigate('/customer')}
            className="px-8 py-3 bg-blue-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-400 hover:text-black transition-all shadow-xl"
          >
            Khám phá các mẫu xe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cart.map(item => (
            <div key={item.id} className="group bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row gap-8 relative overflow-hidden">
              {/* Ảnh xe */}
              <div className="w-full md:w-64 h-44 bg-gray-50 rounded-[2rem] overflow-hidden flex items-center justify-center p-4">
                <img 
                  src={item.duongDanHinhAnh || "https://via.placeholder.com/150"} 
                  alt={item.mauXe}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Thông tin xe */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">{item.mauXe}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all group-hover:scale-110"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mt-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phiên bản</p>
                      <p className="text-sm font-bold text-gray-700">{item.phienBan}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Màu ngoại thất</p>
                      <p className="text-sm font-bold text-gray-700">{item.mauNgoaiThat}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Màu nội thất</p>
                      <p className="text-sm font-bold text-gray-700">{item.mauNoiThat}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Loại Pin</p>
                      <p className="text-sm font-bold text-gray-700">{item.loaiPin}</p>
                    </div>
                    <div className="space-y-0.5 col-span-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Chất liệu nội thất</p>
                      <p className="text-sm font-bold text-gray-700">{item.loaiNoiThat}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Giá trị:</span>
                  <p className="text-2xl font-black text-orange-500">
                    {item.gia.toLocaleString()} <span className="text-xs">₫</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thanh tổng kết (Sticky Footer) */}
      {cart.length > 0 && (
        <div className="sticky bottom-6 bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-10 duration-500">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Tổng cộng thanh toán</p>
            <div className="text-4xl font-black text-blue-900 tracking-tighter">
              {total.toLocaleString()} <span className="text-xl">₫</span>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full md:w-auto bg-orange-300 text-black px-12 py-5 rounded-3xl text-lg font-black uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all shadow-xl shadow-orange-100 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Tiến hành đặt cọc</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
      
      <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest italic pt-6">
        * Giá đã bao gồm thuế GTGT. Phí làm biển số và các phí khác tính tại thời điểm nhận xe.
      </p>
    </div>
  );
}