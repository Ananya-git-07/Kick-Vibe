import { useState, useEffect } from 'react';
import { getOrderHistory } from '../../lib/api';
import Loader from '../../components/Loader';
import { PackageX } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderHistory();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to format currency
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper for status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // pending/processing
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <PackageX className="mx-auto h-12 w-12 text-(--text-color)/40" />
        <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
        <p className="mt-1 text-sm text-(--text-color)/60">Time to grab some new kicks!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-(--border-color) rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-(--bg-color) px-4 py-3 border-b border-(--border-color) flex flex-wrap justify-between items-center gap-2">
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-(--text-color)/60">Order Placed</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-(--text-color)/60">Total</p>
                  <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-(--text-color)/60">Order # {order._id.slice(-8).toUpperCase()}</p>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-4 py-4 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-(--text-color)/60">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;