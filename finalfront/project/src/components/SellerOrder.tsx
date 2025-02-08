import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from '../components/Navbar';

interface Order {
  UserID: string;
  Email: string;
  Phone: string;
  Address: string;
  PaymentMethod: string;
  PaymentInformation: string;
  order_items: {
    ProductID: string;
    Price: string;
    Quantity: number;
    OrderDate: string;
  }[];
}

interface FraudPrediction {
  [key: string]: string; // Mapping of buyer_id -> fraud prediction
}

function SellerOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [fraudPredictions, setFraudPredictions] = useState<FraudPrediction>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const sellerID = localStorage.getItem("seller_id");

  useEffect(() => {
    if (!sellerID) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    const sanitizedSellerId = sellerID ? sellerID.replace(/"/g, "") : "";

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/orders?SellerID=${sanitizedSellerId}`);
        setOrders(response.data);
        fetchFraudPredictions(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchFraudPredictions = async (orders: Order[]) => {
      const predictions: FraudPrediction = {};

      await Promise.all(
        orders.map(async (order) => {
          try {
            const buyerID = order.UserID;
            const predictionResponse = await axios.get(`http://127.0.0.1:8000/api/buyer_fraud_model/?buyer_id=${buyerID}`);
            predictions[buyerID] = predictionResponse.data.fraud_prediction;
          } catch (error) {
            console.error("Error fetching fraud prediction:", error);
            predictions[order.UserID] = "Error";
          }
        })
      );

      setFraudPredictions(predictions);
    };

    if (sellerID) {
      fetchOrders();
    }
  }, [sellerID]);

  const handleViewMore = (order: Order) => {
    const orderDetails = `
      <html>
        <head>
          <title>Order Details</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { padding: 20px; font-family: Arial, sans-serif; background-color: #f8f9fa; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
            h2 { text-align: center; margin-bottom: 20px; }
            .table { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="text-primary">Order Details</h2>
            <table class="table table-striped table-bordered">
              <tbody>
                <tr><th>UserID</th><td>${order.UserID}</td></tr>
                <tr><th>Email</th><td>${order.Email}</td></tr>
                <tr><th>Phone</th><td>${order.Phone}</td></tr>
                <tr><th>Address</th><td>${order.Address}</td></tr>
                <tr><th>Payment Method</th><td>${order.PaymentMethod}</td></tr>
                <tr><th>Payment Information</th><td>${order.PaymentInformation}</td></tr>
              </tbody>
            </table>
            
            <h3 class="text-secondary">Order Items</h3>
            <table class="table table-hover table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                ${order.order_items
                  .map(
                    (item) => ` 
                      <tr>
                        <td>${item.ProductID}</td>
                        <td>₹${parseFloat(item.Price).toFixed(2)}</td>
                        <td>${item.Quantity}</td>
                        <td>${new Date(item.OrderDate).toLocaleString()}</td>
                      </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.write(orderDetails);
      newTab.document.close();
    }
  };
  

  const getFraudPredictionColor = (prediction: string) => {
    if (prediction === "Fraud") {
      return "text-red-500"; // Red for fraud
    } else if (prediction === "Not Fraud") {
      return "text-green-500"; // Green for not fraud
    }
    return "text-gray-500"; // Default gray for loading or error state
  };

  const handleBackButton = () => {
    window.location.replace("/seller"); // Navigate back to seller page
  };

  if (!isLoggedIn) {
    return <div>You must be logged in to view orders.</div>;
  }

  return (
    <div>
      <Navbar userRole="buyer" onLogout={() => window.location.replace('/login')} />
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Seller Orders</h2>
      <button
        onClick={handleBackButton}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Back
      </button>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">UserID</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Order Date</th>
              <th className="px-4 py-2 border">View More</th>
              <th className="px-4 py-2 border">Fraud Prediction</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const fraudPrediction = fraudPredictions[order.UserID] || "Loading..."; // Default to loading state
              console.log(fraudPrediction);
              return (
                <tr key={order.UserID}>
                  <td className="px-4 py-2 border">{order.UserID}</td>
                  <td className="px-4 py-2 border">{order.Email}</td>
                  <td className="px-4 py-2 border">{order.order_items[0]?.OrderDate}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleViewMore(order)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View More
                    </button>
                  </td>
                  <td className={`px-4 py-2 border ${fraudPrediction.Prediction == "Fraud" ? "text-red-500 font-bold" : fraudPrediction.Prediction == "Not Fraud" ? "text-green-500 font-bold" : "text-gray-500"}`}>
                  {fraudPrediction}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default SellerOrder;
