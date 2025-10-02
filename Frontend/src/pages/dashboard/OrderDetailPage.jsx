import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../lib/api';
import Loader from '../../components/Loader';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const formatPrice = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) return <Loader />;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <Link to="/dashboard/orders" className="text-sm text-(--brand-color) hover:underline mb-6 inline-block">
        &larr; Back to Orders
      </Link>
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>
      <p className="text-sm text-(--text-color)/60 mb-6">Order ID: {order._id}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-2">Items Ordered</h2>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.shoeId} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity} (Size: {item.size})</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-(--border-color) mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <address className="not-italic text-sm text-(--text-color)/80">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </address>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;