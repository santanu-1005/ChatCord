import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '../services/api'; // Import Axios service
/**
 * AuthContext provides authentication state and methods throughout the application
 * This is a mock implementation that simulates authentication behavior
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component that wraps app and makes auth object available to any
 * child component that calls useAuth().
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  // const login = async (email, password) => {
  //   try {
  //     const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
  //     setCurrentUser(response.data.user);
  //     setIsAuthenticated(true);
  //     localStorage.setItem('user', JSON.stringify(response.data.user));
  //     localStorage.setItem('token', response.data.token);
  //     return true;
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     return false;
  //   }
  // };

  // const register = async (name, email, password) => {
  //   try {
  //     const response = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
  //     setCurrentUser(response.data.user);
  //     setIsAuthenticated(true);
  //     localStorage.setItem('user', JSON.stringify(response.data.user));
  //     localStorage.setItem('token', response.data.token);
  //     return true;
  //   } catch (error) {
  //     console.error('Register error:', error);
  //     throw error;
  //   }
  // };

   const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password); // Use the Axios service method
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const data = await register(name, email, password); // Use the Axios service method
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login: handleLogin, register: handleRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
