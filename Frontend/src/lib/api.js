import axios from 'axios';

// Create a single, configured Axios instance.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true, // Crucial for sending/receiving cookies for authentication
});


// --- Axios Interceptor for Token Refresh ---
// This is the magic that will handle token expiration automatically.
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried this request

      try {
        // Attempt to refresh the access token
        await api.post('/users/refresh-token');
        
        // If the refresh is successful, Axios will have the new token in its cookies.
        // We can now retry the original request that failed.
        return api(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, it means the user's session is truly expired.
        // We should redirect them to the login page.
        // You can also dispatch a custom "logout" event here if using a global event bus.
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just pass them along.
    return Promise.reject(error);
  }
);


// --- Shoe Endpoints ---
export const getFeaturedShoes = async () => {
  const response = await api.get('/shoes/featured');
  return response.data.data;
};

export const getNewArrivals = async () => {
  const response = await api.get('/shoes/new-arrivals');
  return response.data.data;
};

export const getAllShoes = async (filters = {}) => {
  const response = await api.get('/shoes', { params: filters });
  return response.data.data;
};

export const getShoeById = async (shoeId) => {
  const response = await api.get(`/shoes/${shoeId}`);
  return response.data.data;
};

// NEW: Search for shoes
export const searchShoes = async (query) => {
  const response = await api.get('/shoes/search', { params: { q: query } });
  return response.data.data;
}


// --- Cart Endpoints ---
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data.data;
};

export const addItemToCart = async (item) => {
  const response = await api.post('/cart/add', item);
  return response.data.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/item/${itemId}`, { quantity });
  return response.data.data;
};

export const removeItemFromCart = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);
  return response.data.data;
};


// --- Order Endpoints ---
export const createOrder = async (orderDetails) => {
  const response = await api.post('/orders', orderDetails);
  return response.data.data;
};

// NEW: Get user's order history
export const getMyOrders = async () => {
  const response = await api.get('/orders/history');
  return response.data.data;
}

// NEW: Get a single order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.data;
}


// --- Wishlist Endpoints (NEW) ---
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data.data;
};

export const toggleWishlistItem = async (shoeId) => {
  const response = await api.post(`/wishlist/toggle/${shoeId}`);
  return response.data.data;
};


// --- Review Endpoints (NEW) ---
export const getShoeReviews = async (shoeId) => {
  const response = await api.get(`/reviews/shoe/${shoeId}`);
  return response.data.data;
};

export const createReview = async (shoeId, reviewData) => {
  const response = await api.post(`/reviews/create/${shoeId}`, reviewData);
  return response.data.data;
};


// --- User Profile Endpoints (NEW) ---
export const updateAccountDetails = async (userData) => {
  const response = await api.patch('/users/update-account', userData);
  return response.data.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response.data.data;
};


export default api;