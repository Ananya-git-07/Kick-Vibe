import { useState, useEffect } from 'react';
import { adminGetDashboardStats } from '../../lib/api';
import Loader from '../../components/Loader';
import { DollarSign, ShoppingCart, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-(--surface-color) p-6 rounded-lg border border-(--border-color) shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-(--text-color)/60">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-md ${color}/10`}>
            <Icon className={`h-6 w-6 ${color}`} />
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminGetDashboardStats();
                setStats(data);
            } catch (error) {
                toast.error("Failed to load dashboard stats.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatPrice = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatPrice(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    color="text-green-500"
                />
                <StatCard
                    title="Total Sales"
                    value={stats?.totalOrders || 0}
                    icon={ShoppingCart}
                    color="text-blue-500"
                />
                <StatCard
                    title="Total Customers"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="text-purple-500"
                />
            </div>

            {/* Recent Orders */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="bg-(--surface-color) rounded-lg border border-(--border-color) shadow-sm">
                    {stats?.recentOrders.length > 0 ? (
                        <ul>
                            {stats.recentOrders.map((order, index) => (
                                <li key={order._id} className={`p-4 flex justify-between items-center ${index < stats.recentOrders.length - 1 ? 'border-b border-(--border-color)' : ''}`}>
                                    <div>
                                        <p className="font-medium">{order.owner.fullName}</p>
                                        <p className="text-sm text-(--text-color)/60">{order.items.length} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
                                        <p className="text-sm text-(--text-color)/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-8 text-center text-(--text-color)/60">No recent orders found.</p>
                    )}
                </div>
                 <div className="mt-4 text-right">
                    <Link to="/admin/orders" className="text-sm font-medium text-(--brand-color) hover:underline flex items-center justify-end gap-1">
                        View All Orders <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;