import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as CartAPI from '../lib/api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // --- FIX STARTS HERE ---
  // Replace the old useCallback/useEffect with a single, robust useEffect.
  useEffect(() => {
    // This function fetches the cart data for an authenticated user.
    const loadCartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cartData = await CartAPI.getCart();
        setCart(cartData);
      } catch (err) {
        setError('Failed to fetch cart.');
        console.error(err);
        setCart(null); // Also clear cart on error
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      // If the user is authenticated, fetch their cart.
      loadCartData();
    } else {
      // If the user is NOT authenticated, explicitly clear any existing cart state.
      // This is the crucial cleanup step.
      setCart(null);
    }
  }, [isAuthenticated]); // This effect now ONLY and DIRECTLY depends on the auth status.
  // --- FIX ENDS HERE ---


  const addItem = async (item) => {
    try {
      const updatedCart = await CartAPI.addItemToCart(item);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to add item to cart.');
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const updatedCart = await CartAPI.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update cart item.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const updatedCart = await CartAPI.removeItemFromCart(itemId);
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to remove cart item.');
    }
  };

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotalPrice = cart?.cartTotalPrice || 0;

  const value = {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    cartItemCount,
    cartTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};