import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../lib/api';
import Loader from '../../components/Loader';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="p-4 border border-(--border-color) rounded-lg bg-(--surface-color)">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Order ID: {order._id}</p>
                  <p className="text-sm text-(--text-color)/60">Date: {formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{order.orderStatus}</span>
              </div>
              <div className="mt-4 border-t border-(--border-color) pt-4">
                <p className="font-semibold">Total: {formatPrice(order.totalPrice)}</p>
                <Link to={`/dashboard/orders/${order._id}`} className="text-sm text-(--brand-color) hover:underline mt-2 inline-block">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>You have no past orders.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;