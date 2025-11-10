import { useState, useEffect } from 'react';
import { adminGetAllUsers } from '../../lib/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

const UsersDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminGetAllUsers();
                setUsers(data);
            } catch (error) {
                toast.error('Failed to fetch users.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    if (isLoading) return <Loader />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <div className="bg-(--surface-color) rounded-lg border border-(--border-color) shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-(--border-color) text-(--text-color)/60">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-(--border-color) last:border-b-0">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={user.avatar} alt={user.fullName} className="h-9 w-9 object-cover rounded-full" />
                                    <span className="font-medium">{user.fullName}</span>
                                </td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    {user.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            <ShieldCheck size={14} />
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="capitalize">{user.role}</span>
                                    )}
                                </td>
                                <td className="p-4">{formatDate(user.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersDashboardPage;