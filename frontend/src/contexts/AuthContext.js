import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to get user profile if token exists
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Store JWT token in localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Fetch user profile with the token
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/auth/profile');
      setCurrentUser(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Session expired. Please login again.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Login attempt with email:', email);
      
      // Validate inputs before sending to server
      if (!email || !password) {
        console.error('Missing login credentials');
        setError('Email and password are required');
        return { 
          success: false, 
          error: 'Email and password are required' 
        };
      }
      
      // Prepare data as a plain object
      const loginData = {
        email: email.trim(),
        password: password
      };
      
      console.log('Sending login request to server with data:', {
        email: loginData.email,
        password: '********'
      });
      
      // Make the login request with explicit Content-Type
      const response = await axiosInstance.post('/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful, response:', response.data);
      
      // Store the user and token in state
      setCurrentUser(response.data.user);
      setToken(response.data.token);
      setError('');
      
      return { success: true };
    } catch (err) {
      console.error('Login error details:', err);
      
      // Add more specific error logging
      if (err.response) {
        console.error('Server response error:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      } else if (err.request) {
        console.error('No response received from server');
      } else {
        console.error('Request setup error:', err.message);
      }
      
      // Provide a more specific error message
      let errorMessage = 'Failed to login';
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = 'Network connection error. Please check your internet connection.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      
      // Log the request data for debugging
      console.log('Register attempt with:', { 
        username, 
        email, 
        password: '********' 
      });
      
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password
      });
      
      console.log('Register response:', response.data);
      
      setCurrentUser(response.data.user);
      setToken(response.data.token);
      setError('');
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      
      // Enhanced error logging for debugging
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      
      setError(err.response?.data?.message || 'Failed to register');
      return { success: false, error: err.response?.data?.message || 'Failed to register' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setError('');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;