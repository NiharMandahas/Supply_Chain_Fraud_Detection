import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { Plus } from 'lucide-react';

interface Product {
  seller_id: string;
  seller_name: string;
  item_name: string;
  category: string;
  image_address: string;
  price: number;
}

function Seller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    const storedSellerId = localStorage.getItem('seller_id');
    console.log(storedSellerId);
    if (!storedSellerId) return;
    const sanitizedSellerId = storedSellerId ? storedSellerId.replace(/"/g, '') : '';
    console.log(sanitizedSellerId);  // Make sure it’s correct
    axios.get(`http://localhost:8000/api/products/?seller_id=${sanitizedSellerId}`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleAddProduct = (productData: Product) => {
    axios.post('http://localhost:8000/api/products/', productData)
      .then(response => {
        setProducts([...products, response.data]);
        setShowAddProduct(false);
      })
      .catch(error => console.error('Error adding product:', error));
  };

  return (
    <div>
      <Navbar userRole="seller" onLogout={() => window.location.replace('/login')} />
      <div className="container mx-auto px-4 py-8">
        {!showAddProduct ? (
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New Product</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {products.map((product) => (
            <ProductCard
              key={product.item_name}
              product={product}
              userRole='seller'
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Seller;
