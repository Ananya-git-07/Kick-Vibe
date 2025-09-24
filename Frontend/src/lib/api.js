import axios from 'axios';

// Create a single, configured Axios instance.
// It uses the VITE_BACKEND_URL from your .env file to set the base URL.
// This ensures that all API calls are directed to your backend server.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
  withCredentials: true, // This is crucial for sending/receiving cookies for authentication
});


// --- Shoe Endpoints ---

/**
 * Fetches the list of featured shoes from the backend.
 * Corresponds to the GET /shoes/featured endpoint.
 */
export const getFeaturedShoes = async () => {
  const response = await api.get('/shoes/featured');
  return response.data.data;
};

/**
 * Fetches the list of new arrival shoes from the backend.
 * Corresponds to the GET /shoes/new-arrivals endpoint.
 */
export const getNewArrivals = async () => {
  const response = await api.get('/shoes/new-arrivals');
  return response.data.data;
};

/**
 * Fetches all shoes with optional filtering.
 * Corresponds to the GET /shoes endpoint.
 * @param {object} filters - An object containing filter queries (e.g., { category: 'sneakers' })
 */
export const getAllShoes = async (filters = {}) => {
  const response = await api.get('/shoes', {
    params: filters // Axios converts this to URL query parameters
  });
  return response.data.data;
};

/**
 * Fetches a single shoe by its ID.
 * Corresponds to the GET /shoes/:id endpoint.
 * @param {string} shoeId - The ID of the shoe to fetch.
 */
export const getShoeById = async (shoeId) => {
  const response = await api.get(`/shoes/${shoeId}`);
  return response.data.data;
};


// --- Cart Endpoints ---

/**
 * Fetches the user's current cart from the backend.
 */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data.data;
};

/**
 * Adds an item to the user's cart.
 * @param {object} item - { shoeId, quantity, size }
 */
export const addItemToCart = async (item) => {
  const response = await api.post('/cart/add', item);
  return response.data.data;
};

/**
 * Updates the quantity of an item in the cart.
 * @param {string} itemId - The ID of the cart item.
 * @param {number} quantity - The new quantity.
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/item/${itemId}`, { quantity });
  return response.data.data;
};

/**
 * Removes an item from the user's cart.
 * @param {string} itemId - The ID of the cart item to remove.
 */
export const removeItemFromCart = async (itemId) => {
  const response = await api.delete(`/cart/item/${itemId}`);
  return response.data.data;
};


// --- Order Endpoint ---

/**
 * Creates a new order from the user's cart.
 * @param {object} orderDetails - { shippingAddress, paymentMethod }
 */
export const createOrder = async (orderDetails) => {
  const response = await api.post('/orders', orderDetails);
  return response.data.data;
};




// We don't need a default export if we are exporting named functions,
// but exporting the instance can be useful for direct use elsewhere.
export default api;