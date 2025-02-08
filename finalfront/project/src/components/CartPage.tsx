import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div>
          <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button
          onClick={() => navigate('/buyer')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
      </div>
    );
  }

  return (
    <div>
        <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img src={item.image_address} alt={item.item_name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{item.item_name}</h3>
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="text-xl font-bold">Total: ₹{total.toFixed(2)}</div>
        <button
          onClick={() => navigate('/checkout')}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
    </div>
  );
}
