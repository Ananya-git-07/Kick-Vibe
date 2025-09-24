import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';

const CheckoutPage = () => {
  const { cart, cartTotalPrice, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  // Function to format price to INR
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    setError('');

    try {
      const orderDetails = {
        shippingAddress,
        paymentMethod: 'Credit Card', // Hardcoded for now. A real app would use Stripe/PayPal.
      };
      const newOrder = await createOrder(orderDetails);
      // On success, redirect to an order confirmation page, passing the new order ID
      navigate(`/order-success/${newOrder._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartLoading) return <div className="text-center py-20">Loading your cart...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-(--text-color)/60">You can't proceed to checkout with an empty cart.</p>
        <Button to="/products" className="mt-6">Go Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-center mb-10">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2 bg-(--surface-color) p-8 rounded-lg border border-(--border-color)">
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input id="street" label="Street Address" value={shippingAddress.street} onChange={handleInputChange} required />
            <Input id="city" label="City" value={shippingAddress.city} onChange={handleInputChange} required />
            <Input id="state" label="State / Province" value={shippingAddress.state} onChange={handleInputChange} required />
            <Input id="postalCode" label="Postal Code" value={shippingAddress.postalCode} onChange={handleInputChange} required />
            <Input id="country" label="Country" value={shippingAddress.country} onChange={handleInputChange} required />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-(--border-color) rounded-lg bg-(--surface-color) sticky top-24">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            <div className="space-y-2 mb-4">
              {cart.items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="truncate pr-4">{item.shoe.name} x {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.shoe.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-(--border-color) pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotalPrice)}</span>
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
            <Button type="submit" className="w-full mt-6" disabled={isPlacingOrder}>
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;