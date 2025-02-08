import { Product } from '../types';
import { ShoppingBag, Check, Pencil } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: Product;
    userRole: 'buyer' | 'seller';
    onEdit?: () => void;
}

export function ProductCard({ product, userRole, onEdit }: ProductCardProps) {
    const [isAdded, setIsAdded] = useState(false);
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const isInCart = cart.some(item => item.id === product.product_id);

    const handleViewDetails = () => {
        navigate(`/product/${product.product_id}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-200">
            <div className="relative">
                <img
                    src={product.image_address}
                    alt={product.item_name}
                    className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.item_name}</h3>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ₹{formatPrice(product.price)}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{product.category}</p>
                <p className="text-gray-500 dark:text-gray-400">Sold by: {product.seller_name}</p>

                {/* Buyer Actions */}
                {userRole === 'buyer' && (
                    <div className="flex flex-col space-y-2 mt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`flex items-center justify-center space-x-2 px-4 py-2 w-full ${
                                isAdded 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                            } text-white rounded-lg transition-all duration-200`}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Added to Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>{isInCart ? 'Add Again' : 'Add to Cart'}</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleViewDetails}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            View Details
                        </button>
                    </div>
                )}

                {/* Seller Actions (Edit Button) */}
                {userRole === 'seller' && onEdit && (
                    <div className="mt-4">
                        <button
                            onClick={onEdit}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 w-full"
                        >
                            <Pencil className="w-5 h-5" />
                            <span>Edit</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
