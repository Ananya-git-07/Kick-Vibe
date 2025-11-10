import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';
import AppPreloader from '../components/AppPreloader'; // <-- IMPORT

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // This now controls the preloader

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get('/users/current-user');
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        // Add a small delay for a smoother transition
        setTimeout(() => setLoading(false), 500);
      }
    };
    checkUserStatus();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/users/login', credentials);
    console.log("USER DATA RECEIVED ON LOGIN:", response.data.data.user); 
    setUser(response.data.data.user);
    return response.data.data.user;
  };

  const register = async (userData) => {
    const response = await api.post('/users/register', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  // --- NEW FUNCTION to update local user state ---
  const updateUser = (userData) => {
    setUser(prev => ({...prev, ...userData}));
  };

   const value = {
    user,
    isAuthenticated: !!user,
    // We no longer need to export 'loading' in the value object for other components
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      <AppPreloader isLoading={loading} />
      {!loading && children}
    </AuthContext.Provider>
  );
};