import { Routes, Route, useLocation } from 'react-router-dom'; // <-- IMPORT useLocation
import { AnimatePresence } from 'framer-motion';

// Import Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import Page Components
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SearchPage from './pages/SearchPage'; // <-- IMPORT
import NotFoundPage from './pages/NotFoundPage';

// Import Account Components
import AccountLayout from './components/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import OrdersPage from './pages/account/OrdersPage';
import ChangePasswordPage from './pages/account/ChangePasswordPage';
import WishlistPage from './pages/account/WishlistPage';
import AuthLayout from './components/AuthLayout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsDashboardPage from './pages/admin/ProductsDashboardPage';
import OrdersDashboardPage from './pages/admin/OrdersDashboardPage';
import UsersDashboardPage from './pages/admin/UsersDashboardPage';

function App() {
  const location = useLocation(); // <-- Get current location

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait"> {/* <-- WRAPPER */}
          {/* The key tells AnimatePresence when the component changes */}
          <Routes location={location} key={location.pathname}>
            {/* ... all your routes ... */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            {/* Protected Account Routes (Nested) */}
          <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="security" element={<ChangePasswordPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsDashboardPage />} />
              <Route path="orders" element={<OrdersDashboardPage />} />
              <Route path="users" element={<UsersDashboardPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;