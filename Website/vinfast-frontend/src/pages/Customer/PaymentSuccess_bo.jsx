import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
            <div style={{ fontSize: '60px', color: '#28a745' }}>✔️</div>
            <h1 style={{ color: '#28a745' }}>Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã tin tưởng VinFast.</p>
            <p>Mã đơn hàng của bạn là: <strong>#{orderId}</strong></p>
            <div style={{ marginTop: '30px' }}>
                <div style={{ marginTop: '30px' }}>
    <Link to="/customer" style={{ 
    padding: '10px 20px', 
    backgroundColor: '#007bff', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '5px' 
}}>
    Quay về danh sách xe
</Link>

    {/* SỬA DÒNG DƯỚI ĐÂY: từ /profile thành /customer/orders */}
    <Link to="/customer/orders" style={{ 
        marginLeft: '10px',
        padding: '10px 20px', 
        backgroundColor: '#6c757d', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px' 
    }}>
        Xem đơn hàng
    </Link>
</div>
            </div>
        </div>
    );
};

export default PaymentSuccess;