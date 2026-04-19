import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try{
        const res = await api.post('/auth/login', credentials);
        // Kiểm tra nếu đăng nhập thành công (tùy vào cấu trúc API trả về)
        if (res.data.success || res.data.token) {
          localStorage.setItem('token', res.data.token);
      
          // LƯU Ý: Lưu toàn bộ thông tin user (bao gồm vai_tro) vào localStorage
          // Nếu API trả về user nằm trong res.data.user thì dùng res.data.user
          const userData = res.data.user || res.data;
          localStorage.setItem('user', JSON.stringify(userData));
      
          setUser(userData);
          }
          return res.data;
    }catch(error){
    // Trả về dữ liệu lỗi từ Backend nếu có, hoặc lỗi mặc định
    return error.response?.data || { success: false, message: 'Lỗi kết nối server' };
    }
    
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Khôi phục user từ localStorage khi refresh trang
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Lỗi khi khôi phục phiên đăng nhập:", error);
          logout();
        }
      }
      // Quan trọng: Chỉ tắt loading sau khi đã kiểm tra xong localStorage
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};