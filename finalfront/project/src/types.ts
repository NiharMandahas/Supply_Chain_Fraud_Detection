export interface Product {
  product_id: string;
  seller_name: string;
  seller_id: string; // Adding seller ID for detailed view
  category: string;
  item_name: string;
  image_address: string;
  price: string | number;
  Description: string; // Adding description for detailed view
  account_age: string | number;
  return_rate: string | number;
}

export interface User {
  id: string;
  email: string;
  role: 'buyer' | 'seller';
  name: string;
}

export interface Seller{
  category: string;
  account_age: number;
  return_rate: number;
  fulfillmentRate: number;
  delay_rate: number;
  cancelled_rate: number;
  listings: number;
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}

// New interfaces for cart functionality
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// New interfaces for order management
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  
}

export interface Order {
  id?: number;
  user_id: string;
  email: string;
  phone: string;
  address: string;
  payment_method: PaymentMethod;
  payment_info: string;
  total_amount: number;
  status?: OrderStatus;
  created_at?: string;
  updated_at?: string;
  items: OrderItem[];
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'cod';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Form interfaces
export interface CheckoutFormData {
  user_id: string;
  email: string;
  phone: string;
  address: string;
  payment_method: PaymentMethod;
  payment_info: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface OrderCreationResponse {
  message: string;
  order_id: number;
}

// Context interfaces
export interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export interface OrderContextType {
  orders: Order[];
  loadOrders: (userId: string) => Promise<void>;
  createOrder: (orderData: Order) => Promise<OrderCreationResponse>;
  getOrderDetails: (orderId: number) => Promise<Order>;
}
