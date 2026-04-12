import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import CustomerLayout from './components/Layout/CustomerLayout';
import DealerLayout from './components/Layout/DealerLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Public Pages
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import Home from './pages/Public/Home';
import CarDetail from './pages/Public/CarDetail';

// Customer Pages
import Cars from './pages/Customer/Cars';
import Cart from './pages/Customer/Cart';
import Checkout from './pages/Customer/Checkout';
import MyOrders from './pages/Customer/MyOrders';

// Dealer Pages
import DealerOrders from './pages/Dealer/Orders';
import Inventory from './pages/Dealer/Inventory';
import Customers from './pages/Dealer/Customers';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import CarsManagement from './pages/Admin/CarsManagement';
import UsersManagement from './pages/Admin/UsersManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ==================== PUBLIC ROUTES (Không có Layout) ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/car/:id" element={<CarDetail />} />

          {/* ==================== CUSTOMER ROUTES ==================== */}
          <Route path="/customer/*" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Cars />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          {/* ==================== DEALER ROUTES ==================== */}
          <Route path="/dealer/*" element={
            <ProtectedRoute allowedRoles={['DealerStaff']}>
              <DealerLayout />
            </ProtectedRoute>
          }>
            <Route path="orders" element={<DealerOrders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
          </Route>

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cars" element={<CarsManagement />} />
            <Route path="users" element={<UsersManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;