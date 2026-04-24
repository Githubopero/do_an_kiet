import React from 'react';

// Sử dụng forwardRef để react-to-print có thể móc vào
export const PrintableInvoice = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div ref={ref} className="p-10 text-black bg-white">
      {/* Header Hóa Đơn */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-blue-900">Hóa Đơn Giá Trị Gia Tăng</h1>
          <p className="text-sm mt-1">Mã đơn hàng: <span className="font-bold">#{order.id}</span></p>
          <p className="text-sm">Ngày lập: {new Date(order.thoiGianTao).toLocaleString('vi-VN')}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">VINFAST SHOWROOM</h2>
          <p className="text-xs text-gray-500">Hệ thống xe điện thông minh</p>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="mb-8 grid grid-cols-2 gap-4 border p-4 rounded-xl">
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold">Người mua hàng</p>
          <p className="font-bold text-lg">{order.customerName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-gray-400 font-bold">Trạng thái thanh toán</p>
          <p className="font-bold italic">{order.status === 'Delivered' ? 'Đã thanh toán' : 'Đã đặt cọc'}</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left">
            <th className="py-3 font-bold">Sản phẩm & Cấu hình</th>
            <th className="py-3 text-right font-bold">Số lượng</th>
            <th className="py-3 text-right font-bold">Đơn giá cuối</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-100">
              <td className="py-4">
                <p className="font-bold text-blue-900 uppercase">{item.tenXe}</p>
                <p className="text-xs text-gray-600">Phiên bản: {item.tenPhienBan}</p>
                <div className="mt-1">
                   {item.chiTietCauHinh?.map((opt, i) => (
                     <span key={i} className="text-[10px] bg-gray-100 px-1 mr-1 rounded italic">
                       {opt.nhan}: {opt.giaTri}
                     </span>
                   ))}
                </div>
              </td>
              <td className="py-4 text-right">{item.soLuong}</td>
              <td className="py-4 text-right font-bold">{item.giaCuoi?.toLocaleString()} ₫</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng kết */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiền đặt cọc:</span>
            <span>{order.soTienDatCoc?.toLocaleString()} ₫</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-xl font-black text-red-600">
            <span>TỔNG CỘNG:</span>
            <span>{order.tongTien?.toLocaleString()} ₫</span>
          </div>
        </div>
      </div>

      {/* Ký tên */}
      <div className="mt-16 grid grid-cols-2 text-center">
        <div>
          <p className="font-bold">Khách hàng</p>
          <p className="text-xs text-gray-400 mt-12">(Ký và ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-bold">Đại diện showroom</p>
          <p className="text-xs text-gray-500 mt-12">(Ký tên và đóng dấu)</p>
        </div>
      </div>
    </div>
  );
});