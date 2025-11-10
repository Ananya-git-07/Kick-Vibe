import axios from 'axios';

// Create a single, configured Axios instance.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true, // Crucial for cookies
});

// --- User Endpoints ---

export const updateAccountDetails = async (data) => {
  const response = await api.patch('/users/update-account', data);
  return response.data.data;
};

export const changePassword = async (data) => {
  const response = await api.post('/users/change-password', data);
  return response.data;
};

// Expects FormData
export const updateUserAvatar = async (formData) => {
  const response = await api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

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

export const searchShoes = async (query) => {
  const response = await api.get('/shoes/search', { params: { q: query } });
  return response.data.data;
};

export const getShoeById = async (shoeId) => {
  const response = await api.get(`/shoes/${shoeId}`);
  return response.data.data;
};

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

export const getOrderHistory = async () => {
  const response = await api.get('/orders/history');
  return response.data.data;
};

// --- Wishlist Endpoints ---

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data.data;
};

export const toggleWishlistItem = async (shoeId) => {
  const response = await api.post(`/wishlist/toggle/${shoeId}`);
  return response.data.data; // returns { isWishlisted: true/false }
};

// --- Review Endpoints ---

export const getShoeReviews = async (shoeId) => {
  const response = await api.get(`/reviews/shoe/${shoeId}`);
  return response.data.data;
};

export const createReview = async (shoeId, data) => {
  const response = await api.post(`/reviews/create/${shoeId}`, data);
  return response.data.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// --- Admin Endpoints (add these to the end of the file) ---

// data is FormData
export const createShoe = async (data) => {
  const response = await api.post('/shoes/add', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

// data is an object of fields to update
export const updateShoeById = async (shoeId, data) => {
  const response = await api.patch(`/shoes/${shoeId}`, data);
  return response.data.data;
};

export const deleteShoeById = async (shoeId) => {
  const response = await api.delete(`/shoes/${shoeId}`);
  return response.data;
};

export const adminGetAllOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data.data;
};

export const adminGetAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
};

export const adminGetDashboardStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
};

export const createPaymentIntent = async () => {
  const response = await api.post('/payment/create-intent');
  return response.data.data;
};

export default api;