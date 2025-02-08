import React, { useState, useEffect } from 'react';
import { User, Image, DollarSign, Type, FileText } from 'lucide-react';
import { data } from 'react-router-dom';

interface ProductFormProps {
  onSubmit: (product: {
    seller_id: string;
    seller_name: string;
    item_name: string;
    image_address: string;
    price: number;
    Description: string;
  }) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [seller_id, setSellerId] = useState('');
  const [seller_name, setSellerName] = useState('');
  const [item_name, setItemName] = useState('');
  const [image_address, setImageAddress] = useState('');
  const [price, setPrice] = useState('');
  const [Description, setDescription] = useState('');

  useEffect(() => {
    const storedSellerId = localStorage.getItem('seller_id');
    const sanitizedSellerId = storedSellerId ? storedSellerId.replace(/"/g, '') : '';
    console.log(sanitizedSellerId);
    if (sanitizedSellerId) {
      setSellerId(sanitizedSellerId);
      fetch(`http://localhost:8000/api/sellerdata/${sanitizedSellerId}/`)
        .then((res) => res.json())
        .then((data) => setSellerName(data.seller_details.seller_name || ''))
        .catch((err) => console.error('Error fetching seller name:', err));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      seller_id,
      seller_name,
      item_name,
      image_address,
      price: parseFloat(price),
      Description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seller Name (Auto-fetched) */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <User className="w-4 h-4" />
          <span>Seller Name</span>
        </label>
        <input
          type="text"
          value={seller_name}
          readOnly
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Item Name */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Type className="w-4 h-4" />
          <span>Item Name</span>
        </label>
        <input
          type="text"
          value={item_name}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <DollarSign className="w-4 h-4" />
          <span>Price (₹)</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* Image Address */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Image className="w-4 h-4" />
          <span>Image URL</span>
        </label>
        <input
          type="url"
          value={image_address}
          onChange={(e) => setImageAddress(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FileText className="w-4 h-4" />
          <span>Description</span>
        </label>
        <textarea
          value={Description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg"
      >
        <span>Add Product</span>
      </button>
    </form>
  );
}
