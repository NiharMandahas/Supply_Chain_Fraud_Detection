import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';

interface CheckoutFormData {
  UserID: string;
  Email: string;
  Phone: string;
  Address: string;
  PaymentMethod: string;
  PaymentInformation: string;
}

export function CheckoutForm() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    UserID: '',
    Email: '',
    Phone: '',
    Address: '',
    PaymentMethod: 'credit_card',
    PaymentInformation: '',
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }

    // Get UserID from localStorage
    const storedUserID = JSON.parse(localStorage.getItem('buyer_id') || 'null');
    const sanitizedSellerId = storedUserID ? storedUserID.replace(/"/g, '') : '';
    console.log(sanitizedSellerId);
    if (storedUserID) {
      setFormData((prevData) => ({
        ...prevData,
        UserID: sanitizedSellerId,
      }));
    }
  }, [cart, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    try {
      setIsSubmitting(true);
      
      // Format the order data according to backend expectations
      const orderData = {
        ...formData,
        order_items: cart.map(item => ({
          ProductID: item.id,      // Changed from product_id to ProductID
          Price: item.price,       // Changed from price to Price
          Quantity: item.quantity  // Changed from quantity to Quantity
        }))
      };
  
      // Log the payload before sending it
      console.log('Order Data:', orderData);
  
      await axios.post('http://127.0.0.1:8000/api/create-order/', orderData);
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
      if(error.response)
        console.error(error.response.data);

      alert('Error placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>            
      <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {/* Order Summary */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.item_name} x {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        {/* Removed UserID field */}

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.Email}
            onChange={e => setFormData({ ...formData, Email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.Phone}
            onChange={e => setFormData({ ...formData, Phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.Address}
            onChange={e => setFormData({ ...formData, Address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.PaymentMethod}
            onChange={e => setFormData({ ...formData, PaymentMethod: e.target.value })}
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Information</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.PaymentInformation}
            onChange={e => setFormData({ ...formData, PaymentInformation: e.target.value })}
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : `Place Order (₹${total.toFixed(2)})`}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
