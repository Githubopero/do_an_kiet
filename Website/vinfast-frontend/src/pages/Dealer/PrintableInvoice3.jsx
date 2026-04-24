import React from 'react';

export const PrintableInvoice = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

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
    <div ref={ref} className="p-12 text-gray-900 bg-white min-h-[297mm]">
      {/* Header Chuyên nghiệp */}
      <div className="flex justify-between items-start border-b-4 border-blue-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">VinFast</h1>
          <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">Cùng bạn bứt phá mọi giới hạn</p>
        </div>
        <div className="text-right uppercase">
          <h2 className="text-xl font-bold text-gray-800">Hóa đơn đặt hàng</h2>
          <p className="text-sm text-gray-500 font-mono">#{order.id}</p>
        </div>
      </div>

      {/* Thông tin khách hàng & Showroom */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Thông tin khách hàng</h3>
          <p className="text-lg font-bold">{order.customerName}</p>
          <p className="text-sm text-gray-600">Trạng thái đơn: <span className="font-semibold italic text-blue-700">{order.status}</span></p>
          <p className="text-sm text-gray-600 font-mono">Ngày lập: {new Date(order.thoiGianTao).toLocaleString('vi-VN')}</p>
        </div>
        <div className="text-right">
          <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">Đơn vị ủy quyền</h3>
          <p className="text-md font-bold uppercase">Showroom VinFast Việt Nam</p>
          <p className="text-xs text-gray-500 italic">Đã bao gồm thuế giá trị gia tăng (VAT)</p>
        </div>
      </div>

      {/* Nội dung danh sách xe - Giữ cấu trúc giống Modal */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest border-b pb-2">Chi tiết sản phẩm</h3>
        
        {order.items?.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-2xl p-6 bg-gray-50/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-black text-blue-900 uppercase">{item.tenXe}</h4>
                <p className="text-sm font-bold text-blue-600 italic">Phiên bản: {item.tenPhienBan || "Tiêu chuẩn"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold">Thành tiền</p>
                <p className="text-xl font-black">{item.giaCuoi?.toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Cấu hình chi tiết */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-dashed border-gray-300">
              {item.chiTietCauHinh?.map((opt, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{translateKey(opt.nhan)}:</span>
                  <span className="font-bold text-gray-700">{opt.giaTri}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-[10px] text-gray-400 font-mono italic">
              ID Phiên bản: VER-{item.phienBanId} | Số lượng: {item.soLuong}
            </div>
          </div>
        ))}
      </div>

      {/* Tổng kết tài chính */}
      <div className="mt-10 flex justify-end">
        <div className="w-80 space-y-3 bg-blue-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="flex justify-between text-xs opacity-80">
            <span>Tiền đã đặt cọc:</span>
            <span>{order.soTienDatCoc?.toLocaleString()} ₫</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-3">
            <span className="text-sm font-bold uppercase tracking-wider">Tổng thanh toán:</span>
            <span className="text-2xl font-black">{order.tongTien?.toLocaleString()} ₫</span>
          </div>
          <p className="text-[9px] italic opacity-60 text-right">* Giá trị đã bao gồm phí VAT và các tùy chọn kèm theo.</p>
        </div>
      </div>

      {/* Chữ ký & Con dấu */}
      <div className="mt-20 grid grid-cols-2 gap-8 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-16">Đại diện khách hàng</p>
          <div className="border-t border-gray-200 w-3/4 mx-auto pt-2 text-sm font-bold">{order.customerName}</div>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-16">Xác nhận từ Showroom</p>
          <div className="border-t border-gray-200 w-3/4 mx-auto pt-2 text-sm font-bold italic text-blue-900">VinFast Auto (Signed)</div>
        </div>
      </div>

      {/* Footer trang */}
      <div className="mt-24 text-center border-t pt-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
        Mã hóa đơn điện tử được xác thực bởi hệ thống VinFast
      </div>
    </div>
  );
});