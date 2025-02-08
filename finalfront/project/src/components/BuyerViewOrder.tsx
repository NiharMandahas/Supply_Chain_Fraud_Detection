import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';

interface OrderItem {
  ProductID: string;
  Price: string;
  Quantity: number;
  SellerID: string;
}

interface Order {
  UserID: string;
  Email: string;
  Phone: string;
  Address: string;
  PaymentMethod: string;
  PaymentInformation: string;
  OrderDate: string;
  order_items: OrderItem[];
}

interface ProductDetails {
  ProductID: string;
  item_name: string;
  image_address: string;
  seller_name: string;
}

function BuyerViewOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetails>>({});
  const buyerID = JSON.parse(localStorage.getItem('buyer_id') || 'null');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!buyerID) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/buyer-view/?UserID=${buyerID}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, [buyerID]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetailsMap: Record<string, ProductDetails> = {};
      await Promise.all(
        orders.flatMap(order => order.order_items.map(async (item) => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/${item.ProductID}/`);
            productDetailsMap[item.ProductID] = response.data;
          } catch (error) {
            console.error(`Error fetching product details for ${item.ProductID}:`, error);
          }
        }))
      );
      setProductDetails(productDetailsMap);
    };

    if (orders.length > 0) {
      fetchProductDetails();
    }
  }, [orders]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-700 text-lg">You must be logged in to view your order details.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Orders</h2>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order {index + 1}</h3>
                <div className="mb-4"><span className="font-medium">Order Date:</span> {new Date(order.OrderDate).toLocaleString()}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div><span className="font-medium">Email:</span> {order.Email}</div>
                    <div><span className="font-medium">Phone:</span> {order.Phone}</div>
                    <div><span className="font-medium">Address:</span> {order.Address}</div>
                  </div>
                  <div className="space-y-4">
                    <div><span className="font-medium">Payment:</span> {order.PaymentMethod}</div>
                  </div>
                </div>
  
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.order_items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                          <img src={productDetails[item.ProductID]?.image_address || 'https://via.placeholder.com/50'} 
                               alt={productDetails[item.ProductID]?.item_name || 'No Image'} 
                               className="h-12 w-12 rounded-md mr-4" />
                          {productDetails[item.ProductID]?.item_name || 'Unknown Product'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.Quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{(parseFloat(item.Price) * item.Quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No orders found.</div>
        )}
      </div>
    </div>
  );
  
}

export default BuyerViewOrder;
