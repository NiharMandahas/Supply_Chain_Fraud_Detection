import { Product, SellerMetrics } from '../types';

export const mockSellerMetrics: SellerMetrics = {
  accountCreated: new Date('2023-01-15'),
  returnRate: 2.5,
  fulfillmentRate: 98.7,
  delayRate: 1.2,
  cancelledRate: 0.8,
  totalListings: 145,
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vintage Camera',
    description: 'A beautiful vintage camera in excellent condition',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    sellerId: 'seller1',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Mechanical Keyboard',
    description: 'Professional mechanical keyboard with RGB backlight',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    sellerId: 'seller1',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Vintage Record Player',
    description: 'Classic turntable with built-in speakers and Bluetooth connectivity',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882',
    sellerId: 'seller2',
    category: 'Electronics'
  },
  {
    id: '4',
    name: 'Leather Messenger Bag',
    description: 'Handcrafted genuine leather bag with multiple compartments',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    sellerId: 'seller2',
    category: 'Accessories'
  },
  {
    id: '5',
    name: 'Smart Watch',
    description: 'Latest generation smartwatch with health tracking features',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    sellerId: 'seller3',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation',
    price: 289.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    sellerId: 'seller3',
    category: 'Electronics'
  },
  {
    id: '7',
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c',
    sellerId: 'seller1',
    category: 'Home & Garden'
  }
];
