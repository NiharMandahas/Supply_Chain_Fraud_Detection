// OrderDetails.tsx

interface OrderDetailsProps {
    userID: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    paymentInformation: string;
    orderItems: { productID: string; price: string; quantity: number; orderDate: string }[];
  }
  
  const OrderDetails = ({
    userID,
    email,
    phone,
    address,
    paymentMethod,
    paymentInformation,
    orderItems
  }: OrderDetailsProps) => {
    return (
      <div>
        <h2>Order Details</h2>
        <table>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Payment Method</th>
              <th>Payment Info</th>
              <th>Order Items</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userID}</td>
              <td>{email}</td>
              <td>{phone}</td>
              <td>{address}</td>
              <td>{paymentMethod}</td>
              <td>{paymentInformation}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.productID}>
                        <td>{item.productID}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.orderDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default OrderDetails;
  