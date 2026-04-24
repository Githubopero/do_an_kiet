import React from 'react';

export const PrintableInvoice = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  // Hàm phụ trợ để hiển thị text trạng thái giống badge trong Modal
  const getStatusLabel = (status) => {
    const labels = {
      Pending: "Chờ xác nhận",
      Confirmed: "Đã xác nhận",
      Delivered: "Đã bàn giao",
      Cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const translateKey = (key) => {
    const map = {
      mauNgoaiThat: "Màu ngoại thất",
      mauNoiThat: "Màu nội thất",
      loaiPin: "Loại Pin",
      loaiNoiThat: "Kiểu nội thất"
    };
    return map[key] || key;
  };

  return (
    <div ref={ref} className="p-12 bg-white text-slate-900 w-[210mm] min-h-[297mm] font-sans">
      {/* HEADER: Giống header Modal nhưng tối ưu cho bản in */}
      <div className="flex justify-between items-center border-b-4 border-blue-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-blue-900 uppercase">Hóa Đơn Bán Hàng</h1>
          <div className="mt-2 space-y-1 text-sm text-slate-500">
            <p>Mã đơn hàng: <b className="text-slate-800">#{order.id}</b></p>
            <p>Ngày lập: {order.thoiGianTao ? new Date(order.thoiGianTao).toLocaleString('vi-VN') : '---'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-blue-800 italic">VINFAST</h2>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Official Showroom</p>
        </div>
      </div>

      {/* THÔNG TIN CHUNG: Bê nguyên style Card từ Modal */}
      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Khách hàng:</span>
          <b className="text-lg text-slate-800">{order.customerName}</b>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">Trạng thái:</span>
          <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <span className="text-orange-600 font-bold uppercase text-[10px] tracking-wider">Số tiền đã đặt cọc:</span>
          <b className="text-2xl text-orange-600">{order.soTienDatCoc?.toLocaleString()} ₫</b>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM: Bê nguyên style xe từ Modal */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Chi tiết cấu hình xe</h4>
        {order.items?.map((item, idx) => (
          <div key={idx} className="p-6 bg-white rounded-3xl border-2 border-blue-50 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-black text-2xl text-blue-900 uppercase">{item.tenXe || "N/A"}</h3>
                <span className="inline-block bg-blue-900 text-white text-[10px] px-3 py-1 rounded-md font-bold uppercase mt-2">
                  Phiên bản: {item.tenPhienBan || "Tiêu chuẩn"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Giá niêm yết</p>
                <p className="font-bold text-slate-800 text-lg">{item.giaPhienBan?.toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Chi tiết cấu hình */}
            <div className="space-y-2 mb-6">
              {item.chiTietCauHinh?.map((opt, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-600">
                    {translateKey(opt.nhan)}: <b className="text-slate-800">{opt.giaTri}</b>
                  </span>
                  <span className="text-blue-600 font-bold">+{opt.giaChenhLech?.toLocaleString()} ₫</span>
                </div>
              ))}
            </div>

            {/* Thành tiền xe */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase italic">Thành tiền (SL: {item.soLuong})</span>
              <span className="text-2xl font-black text-blue-900">{item.giaCuoi?.toLocaleString()} ₫</span>
            </div>
          </div>
        ))}
      </div>

      {/* TỔNG KẾT CUỐI TRANG */}
      <div className="mt-12 flex justify-end">
        <div className="text-right space-y-2">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tổng giá trị đơn hàng</p>
          <p className="text-5xl font-black text-red-600 tracking-tighter">
            {order.tongTien?.toLocaleString()} <span className="text-2xl">₫</span>
          </p>
          <p className="text-xs italic text-slate-400 mt-2">* Giá trên đã bao gồm thuế VAT và phí dịch vụ kèm theo.</p>
        </div>
      </div>

      {/* CHỮ KÝ */}
      <div className="mt-20 grid grid-cols-2 gap-20 text-center">
        <div>
          <p className="font-black uppercase text-xs tracking-widest mb-20 text-slate-800">Khách hàng</p>
          <div className="border-t border-slate-200 pt-2 italic text-[10px] text-slate-400">Ký và ghi rõ họ tên</div>
        </div>
        <div>
          <p className="font-black uppercase text-xs tracking-widest mb-20 text-slate-800">Xác nhận Showroom</p>
          <div className="border-t border-slate-200 pt-2 italic text-[10px] text-slate-400">Dấu mộc & chữ ký đại diện</div>
        </div>
      </div>

      {/* Footer bản in */}
      <div className="mt-24 text-center border-t border-slate-100 pt-6">
        <p className="text-[9px] text-slate-300 font-mono">Hóa đơn điện tử được khởi tạo từ hệ thống VinFast CRM - {new Date().getFullYear()}</p>
      </div>
    </div>
  );
});