import axios from 'axios';

// Create a base axios instance with default config
const API_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
  // Important: ensure credentials are included for auth requests
  withCredentials: false
});

// Add a request interceptor to add auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Request data:', config.data);
    
    // Ensure Content-Type is set for all requests with a body
    if (config.data && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Log error responses for debugging
    if (error.response) {
      console.error(`API Error: ${error.response.status} from ${error.config.url}`, error.response.data);
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Only clear token for API calls other than login
      if (!error.config.url.includes('/auth/login')) {
        console.log('Unauthorized request - clearing token');
        localStorage.removeItem('token');
        // You could redirect to login here or handle in components
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;