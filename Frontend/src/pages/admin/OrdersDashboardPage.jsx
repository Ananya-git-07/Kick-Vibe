import { useState, useEffect } from 'react';
import { adminGetAllOrders } from '../../lib/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const OrdersDashboardPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await adminGetAllOrders();
                setOrders(data);
            } catch (error) {
                toast.error('Failed to fetch orders.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatPrice = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <div className="bg-(--surface-color) rounded-lg border border-(--border-color) shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-(--border-color) text-(--text-color)/60">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="border-b border-(--border-color) last:border-b-0">
                                <td className="p-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                                <td className="p-4 font-medium">{order.owner.fullName}</td>
                                <td className="p-4">{formatDate(order.createdAt)}</td>
                                <td className="p-4">{formatPrice(order.totalPrice)}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="p-4">{order.items.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersDashboardPage;