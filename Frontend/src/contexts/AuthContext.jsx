import { createContext, useState, useEffect } from 'react';
import api from '../lib/api'; // We'll use our configured axios instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs on initial app load to check if a user is already logged in
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // This endpoint should return the current user if the access token cookie is valid
        const response = await api.get('/users/current-user');
        setUser(response.data.data);
      } catch (error) {
        // If it fails, it means no user is logged in, which is a normal state
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/users/login', credentials);
    setUser(response.data.data.user);
    return response.data.data.user;
  };

  const register = async (userData) => {
    // Note: The backend expects multipart/form-data for registration
    // We will need to create a FormData object in the component
    const response = await api.post('/users/register', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // After registration, we could automatically log them in or ask them to login.
    // For simplicity, we won't auto-login here.
    return response.data.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    setUser(null);
  };

  // The value provided to consuming components
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};