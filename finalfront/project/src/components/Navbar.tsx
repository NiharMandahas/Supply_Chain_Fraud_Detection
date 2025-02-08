import { LogOut, ShoppingCart, Store, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const { cart } = useCart();
  const navigate = useNavigate();

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle logout
  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('buyer_id');
    localStorage.removeItem('seller_id');

    // Redirect to the login page
    navigate('/login');
  };

  // Determine the redirect path based on the buyer_id and seller_id in localStorage
  const buyerId = localStorage.getItem('buyer_id');
  const sellerId = localStorage.getItem('seller_id');

  // Redirect logic based on the presence of buyer_id and seller_id
  let userLink = '/';
  if (buyerId) {
    userLink = '/buyer';
  } else if (sellerId) {
    userLink = '/seller';
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={userLink} className="flex items-center space-x-3">
            <Store className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              Marketplace
            </span>
          </Link>

          {(buyerId || sellerId) && (
            <div className="flex items-center space-x-6">
              {buyerId && (
                <>
                  {/* Move Authenticate link here */}
                  <Link
                    to="/buyer/authenticate-product"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Authenticate
                  </Link>
                  <Link
                    to="/buyer/view-order"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Order
                  </Link>
                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              {sellerId && (
                <>
                  <Link
                    to="/seller/view-orders"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Orders
                  </Link>
                </>
              )}
              <button
                onClick={toggle}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
