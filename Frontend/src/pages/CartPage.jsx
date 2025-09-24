import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, loading, error, updateItem, removeItem, cartTotalPrice } = useCart();

  // Function to format price to INR
  const formatPrice = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-(--text-color)/60">Looks like you haven't added anything to your cart yet.</p>
        <Button to="/products" className="mt-6">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item._id} className="flex items-center gap-4 p-4 border border-(--border-color) rounded-lg bg-(--surface-color)">
              <img src={item.shoe.images[0]} alt={item.shoe.name} className="w-24 h-32 object-cover rounded-md" />
              <div className="flex-grow">
                <h2 className="font-semibold">{item.shoe.name}</h2>
                <p className="text-sm text-(--text-color)/60">Brand: {item.shoe.brand}</p>
                <p className="text-sm text-(--text-color)/60">Size: {item.size}</p>
                <p className="font-bold mt-2">{formatPrice(item.shoe.price)}</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={item.shoe.stock}
                  value={item.quantity}
                  onChange={(e) => updateItem(item._id, parseInt(e.target.value, 10))}
                  className="w-16 text-center border border-(--border-color) rounded-md py-1 bg-(--bg-color)"
                />
                <button onClick={() => removeItem(item._id)} className="text-(--text-color)/50 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 border border-(--border-color) rounded-lg bg-(--surface-color) sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotalPrice)}</span>
            </div>
            <div className="flex justify-between mb-4 text-(--text-color)/60">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-(--border-color) pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(cartTotalPrice)}</span>
            </div>
            <Button to="/checkout" className="w-full mt-6">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;