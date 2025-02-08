import { useState } from "react";
import Web3 from "web3";
import jsQR from "jsqr";
import { Navbar } from "../components/Navbar";
import axios from "axios";

const CONTRACT_ADDRESS = "0x975Fb8C6ad6DB9CE0BF3a9844aF7CA7cB9058B50";
const web3 = new Web3("http://127.0.0.1:7545");

export function QrScanner() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

            if (qrCode) {
              setQrData(qrCode.data);
              try {
                const parsedData = JSON.parse(qrCode.data);
                fetchProductDetails(parsedData.serialNumber);
                setProductDetails(parsedData);
                setError(null);
              } catch (err) {
                console.error("Failed to parse QR code data:", err);
                setError("Invalid QR code data. Expected JSON.");
              }
            } else {
              setError("No QR code found in the image.");
            }
          }
        };
        image.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProductDetails = async (serialNumber: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${serialNumber}`);
      setProductDetails((prevDetails) => ({ ...prevDetails, ...response.data }));
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to fetch product details.");
    }
  };

  return (
    <>
      <Navbar userRole="buyer" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Authenticate Product</h1>
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
          />
        </div>
        {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}
        {productDetails && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md w-full text-gray-900 dark:text-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Product Details</h2>
            <img 
              src={productDetails.image_address} 
              alt={productDetails.item_name} 
              className="w-full h-64 object-contain rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p><strong className="text-gray-600 dark:text-gray-400">Product ID:</strong> {productDetails.product_id}</p>
              <p><strong className="text-gray-600 dark:text-gray-400">Name:</strong> {productDetails.item_name}</p>
              <p><strong className="text-gray-600 dark:text-gray-400">Price:</strong> ₹{productDetails.price}</p>
              <p><strong className="text-gray-600 dark:text-gray-400">Description:</strong> {productDetails.Description}</p>
              {productDetails.manufacturer && (
                <p><strong className="text-gray-600 dark:text-gray-400">Manufacturer:</strong> {productDetails.manufacturer}</p>
              )}
              <p><strong className="text-gray-600 dark:text-gray-400">Blockchain Details:</strong> {productDetails.details}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
