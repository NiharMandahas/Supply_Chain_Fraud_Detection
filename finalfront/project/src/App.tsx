import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Buyer from './components/Buyer';
import Seller from './components/Seller';
import { CartPage } from './components/CartPage';
import { CheckoutForm } from './components/CheckoutPage';
import { CartProvider } from './context/CartContext';
import { ProductDetails } from './components/ProductDetails';
import Register from './components/Register';
import BuyerViewOrder from './components/BuyerViewOrder';
import SellerOrder from './components/SellerOrder'; 
import OrderDetails from './components/OrderDetails'; // Import OrderDetails
import { PrivateRoute } from './components/PrivateRoute';
import {QrScanner } from "./components/Qr"
function App() {
  const user = localStorage.getItem('user');
  const userRole = user ? JSON.parse(user).role : null;

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute redirectTo="/login" />}>
          <Route path="/buyer" element={<Buyer />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/buyer/view-order" element={<BuyerViewOrder />} />
          <Route path="/seller/view-orders" element={<SellerOrder />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/buyer/authenticate-product" element={<QrScanner  />} />
          </Route>
          </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
