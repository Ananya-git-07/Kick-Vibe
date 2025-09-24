import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { fetchCart } = useCart(); // We need to refetch the cart to show it's empty

  // When this page loads, it means an order was successful.
  // We'll trigger a refetch of the cart, which should now be empty.
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
      <p className="mt-4 text-(--text-color)/60">Thank you for your purchase.</p>
      <p className="mt-2 text-sm text-(--text-color)/60">
        Your Order ID is: <span className="font-medium text-(--text-color)">{orderId}</span>
      </p>
      <p className="mt-1 text-sm text-(--text-color)/60">
        You will receive an email confirmation shortly.
      </p>
      <div className="mt-8">
        <Button to="/products">Continue Shopping</Button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;