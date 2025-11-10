import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../lib/api';
import toast from 'react-hot-toast'; // <-- IMPORT

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const wishlistSet = useMemo(() => new Set(wishlistItems.map(item => item._id)), [wishlistItems]);

  const fetchWishlist = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getWishlist();
        setWishlistItems(data || []);
      } catch (err) {
        setError('Failed to fetch wishlist.');
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  const toggleItem = async (shoeId, shoeDetails) => {
    // --- OPTIMISTIC UPDATE LOGIC ---
    const isCurrentlyWishlisted = wishlistSet.has(shoeId);
    
    // 1. Update UI instantly
    if (isCurrentlyWishlisted) {
      setWishlistItems(prev => prev.filter(item => item._id !== shoeId));
    } else {
      // Add a placeholder object. It must have at least an _id.
      // Passing in full shoe details from the component is even better.
      setWishlistItems(prev => [...prev, { _id: shoeId, ...shoeDetails }]);
    }

    try {
      // 2. Make API call
      await api.toggleWishlistItem(shoeId);
    } catch (err) {
      // 3. If API call fails, revert the UI and show error
      toast.error("Could not update wishlist. Please try again.");
      if (isCurrentlyWishlisted) {
        setWishlistItems(prev => [...prev, { _id: shoeId, ...shoeDetails }]);
      } else {
        setWishlistItems(prev => prev.filter(item => item._id !== shoeId));
      }
    }
  };

  const value = {
    wishlistItems,
    wishlistSet,
    toggleItem,
    loading,
    error,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};