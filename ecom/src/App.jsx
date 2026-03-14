



import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { Shop } from './pages/Shop';
import { NotFound } from './pages/NotFound';
import NewArrivals from './pages/NewArrivals';

import AdminLogin from './pages/Admin';
import AdminDashboard from './components/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct';
import ManageOrders from './pages/Admin/ManageOrders';
import Earnings from './pages/Admin/Earnings';
import Inventory from './pages/Admin/Inventory';
import { OrderSuccess } from './pages/OrderSuccess';
import { Account } from './pages/Account';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

import Header from './components/Header';
import Footer from './components/Footer';

import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './ProtectedRoute';
import OnSale from './pages/OnSale';
import EditProduct from './pages/Admin/EditProduct';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/shop" element={<><Header /><Shop /><Footer /></>} />
            <Route path="/product/:slug" element={<><Header /><ProductPage /><Footer /></>} />
            <Route path="/new-arrivals" element={<><Header /><NewArrivals /><Footer /></>} />
            <Route path="/on-sale" element={<><Header /><OnSale /><Footer /></>} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* ================= CUSTOMER ROUTES (ADMIN BLOCKED) ================= */}

            <Route
              path="/cart"
              element={
                <ProtectedRoute blockAdmin>
                  <>
                    <Header />
                    <CartPage />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
             <Route
              path="/account"
              element={
                <ProtectedRoute blockAdmin>
                  <>
                    <Header />
                    <Account />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute blockAdmin>
                  <>
                    <Header />
                    <Checkout />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute blockAdmin>
                  <>
                    <Header />
                    <OrderSuccess />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute blockAdmin>
                  <>
                    <Header />
                    <Orders />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            
            {/* ================= ADMIN DASHBOARD ================= */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Earnings />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="inventory" element={<Inventory />} />


              <Route path="edit-product/:id" element={<EditProduct />} />
            </Route>

            {/* ================= 404 ================= */}
            <Route path="*" element={<><Header /><NotFound /><Footer /></>} />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
