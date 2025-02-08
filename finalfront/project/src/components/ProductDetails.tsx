

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { ShoppingBag, Check, Star, CreditCard } from 'lucide-react';

export function ProductDetails() {
    const { id: productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, cart } = useCart();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<{ rating: number; reviewcontent: string; name: string }[]>([]);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    const [buyerID, setBuyerID] = useState<number | null>(null);
    const [gradioResult, setGradioResult] = useState<string | null>(null);


    const handleGradioPrediction = async (productData) => {
        try {
            const sellerResponse = await axios.get(`http://localhost:8000/api/sellerdata/${productData.seller_id}`);
            const sellerData = sellerResponse.data;
            
            const comments = reviews.map(review => review.reviewcontent);
            console.log(comments);
            
            const predictionData = {
                account_age: sellerData.seller_details.account_age_months,
                return_rate: sellerData.seller_details.return_rate_per_100,
                fullfillment_rate: sellerData.seller_details.fulfillment_rate,
                delay_rate: sellerData.seller_details.delay_rate,
                cancelled_rate: sellerData.seller_details.cancelled_rate,
                listings: sellerData.seller_details.listings,
                comments: comments
            };
            console.log(predictionData);
            const response = await axios.post('http://127.0.0.1:8000/api/predict-seller-score/', predictionData);
            
            if (response.data.success) {
                const isFraud = response.data.prediction === 'Fraud';
                const resultText = isFraud 
                    ? `Prediction Score: <span class="text-red-500 font-bold">Fraud</span>\n${response.data.summary}` 
                    : `Prediction Score: <span class="text-green-500 font-bold">Not Fraud</span>\n${response.data.summary}`;
                setGradioResult(resultText);
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
        }
    };

    
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            setBuyerID(userData.buyer_id);
        }
    }, []);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            try {
                const [productResponse, reviewsResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/api/products/${productId}`),
                    axios.get(`http://127.0.0.1:8000/api/item-reviews/${productId}`)
                ]);

                setProduct(productResponse.data);
                setReviews(reviewsResponse.data);

                // Get prediction immediately after fetching product data
                if (productResponse.data && reviewsResponse.data) {
                    handleGradioPrediction(productResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [productId]);


    if (!product) {
        return <div>Loading...</div>;
    }

    const cartItem = cart.find(item => item.id === product.product_id);
    const isInCart = !!cartItem;

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        setQuantity(1);
    };

    const handleGoBack = () => {
        navigate('/buyer');
    };

    const handleReviewSubmit = async () => {
        if (!buyerID) {
            alert('Please log in to submit a review.');
            return;
        }

        if (!rating || !reviewContent) {
            alert("Please provide a rating and a review.");
            return;
        }

        const reviewData = {
            product_id: productId,
            buyer_id: buyerID,
            rating,
            reviewcontent: reviewContent
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/item-reviews/', reviewData);
            alert("Review submitted successfully!");

            const response = await axios.get(`http://127.0.0.1:8000/api/item-reviews/${productId}`);
            setReviews(response.data);

            setRating(0);
            setReviewContent('');
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        }
    };

    const handleBuyNow = () => {
        addToCart({ ...product, quantity });
        navigate('/checkout');
    };

    

    
      

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
                <button
                    onClick={handleGoBack}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 transition-all duration-200"
                >
                    Back
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={product.image_address}
                        alt={product.item_name}
                        className="w-full md:w-1/2 h-64 object-contain rounded-lg"
                    />

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">{product.item_name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{product.category}</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Sold by: {product.seller_name} (ID: {product.seller_id})
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{product.Description}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                            ₹{product.price}
                        </p>

                        <div className="flex items-center space-x-4 mb-4">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-all duration-200"
                            >
                                -
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-all duration-200"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`flex items-center justify-center space-x-2 px-6 py-2 w-full text-white rounded-lg transition-all duration-200 transform active:scale-95 ${
                                isInCart
                                    ? 'bg-green-500 hover:bg-green-600 shadow-md'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                            }`}
                        >
                            {isInCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Add Again</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex items-center justify-center space-x-2 px-6 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg mt-4 transition-all duration-200 transform active:scale-95"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Buy Now</span>
                        </button>

                        {isInCart && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                In Cart: <strong>{cartItem.quantity}</strong> items
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Customer Reviews ({reviews.length})</h2>
    {reviews.length > 0 ? (
        <ul className="space-y-4">
            {reviews.map((review, index) => (
                <li key={index} className="border-b pb-2">
                    <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500 w-5 h-5" />
                        <span className="font-bold">{review.rating}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            - {review.name}
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.reviewcontent}</p>
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-gray-500">No reviews yet.</p>
    )}

    {/* Review submission form */}
    <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
        <input
            type="number"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className="w-full p-2 border rounded mb-2"
            min="1" max="5"
        />
        <textarea
            placeholder="Write your review..."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className="w-full p-2 border rounded mb-2"
        />
        <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
            Submit Review
        </button>
    </div>
</div>


                {/* Gradio Results Section */}
                <div className="mt-8 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Fraud Prediction</h3>
                {gradioResult && (
                    <div 
                        className="text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: gradioResult }}
                    />
                )}
            </div>
            </div>
        </div>
    );
}


