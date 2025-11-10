import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageWrapper from './PageWrapper';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user.role !== 'admin') {
    // Redirect them to the home page if they are not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;