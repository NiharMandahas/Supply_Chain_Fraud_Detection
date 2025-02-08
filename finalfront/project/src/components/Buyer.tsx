import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

function Buyer() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/products/')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div>
            <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.product_id}
                        product={product}
                        userRole="buyer"
                    />
                ))}
            </div>
        </div>
    );
}

export default Buyer;
