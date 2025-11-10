import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createOrder, createPaymentIntent } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Load Stripe outside of the component to avoid re-creating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- NEW COMPONENT: The Actual Checkout Form ---
const CheckoutForm = ({ shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    // 1. Confirm the payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // We handle the redirect ourselves
    });

    if (stripeError) {
      setErrorMessage(stripeError.message);
      setIsLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      // 2. If payment is successful, create the order in our database
      try {
        const orderDetails = {
          shippingAddress,
          paymentMethod: 'Stripe', // Update payment method
          paymentDetails: {
            paymentId: paymentIntent.id,
            paymentStatus: 'completed'
          }
        };
        const newOrder = await createOrder(orderDetails);
        toast.success('Order placed successfully!');
        navigate(`/order-success/${newOrder._id}`);
      } catch (orderError) {
        setErrorMessage('Payment succeeded, but failed to create order. Please contact support.');
        toast.error('Payment succeeded, but failed to create order. Please contact support.');
      }
    } else {
        setErrorMessage('Payment was not successful. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      <PaymentElement />
      {errorMessage && <div className="mt-4 text-sm text-red-500">{errorMessage}</div>}
      <Button type="submit" className="w-full mt-8" disabled={isLoading || !stripe || !elements}>
        {isLoading ? 'Processing Payment...' : 'Pay & Place Order'}
      </Button>
    </form>
  );
};


// --- MAIN CheckoutPage COMPONENT ---
const CheckoutPage = () => {
  const { cart, cartTotalPrice, loading: cartLoading } = useCart();
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', postalCode: '', country: '' });
  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Fetch a new Payment Intent whenever the cart total changes
    if (cart && cart.items.length > 0) {
      createPaymentIntent()
        .then(data => setClientSecret(data.clientSecret))
        .catch(() => toast.error("Failed to initialize payment. Please refresh."));
    }
  }, [cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };
  
  const formatPrice = (amount) => amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (cartLoading) return <div className="text-center py-20">Loading your cart...</div>;
  if (!cart || cart.items.length === 0) { /* ... same as before ... */ }

  const options = { clientSecret };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-center mb-10">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Step 1 or 2 */}
        <div className="bg-(--surface-color) p-8 rounded-lg border border-(--border-color)">
          {!showPayment ? (
            <form onSubmit={handleProceedToPayment}>
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input id="street" label="Street Address" value={shippingAddress.street} onChange={handleInputChange} required />
                <Input id="city" label="City" value={shippingAddress.city} onChange={handleInputChange} required />
                <Input id="state" label="State / Province" value={shippingAddress.state} onChange={handleInputChange} required />
                <Input id="postalCode" label="Postal Code" value={shippingAddress.postalCode} onChange={handleInputChange} required />
                <Input id="country" label="Country" value={shippingAddress.country} onChange={handleInputChange} required />
              </div>
              <Button type="submit" className="w-full mt-8">Proceed to Payment</Button>
            </form>
          ) : (
            clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm shippingAddress={shippingAddress} />
              </Elements>
            )
          )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;