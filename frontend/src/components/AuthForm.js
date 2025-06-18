import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthForm({ formType, onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formType === 'login') {
      onSubmit(formData.email, formData.password);
    } else {
      onSubmit(formData.username, formData.email, formData.password, formData.confirmPassword);
    }
  };

  const isLoginForm = formType === 'login';
  const buttonText = loading 
    ? (isLoginForm ? 'Logging in...' : 'Creating Account...') 
    : (isLoginForm ? 'Login' : 'Register');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLoginForm ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        
        {/* Display error message if any */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginForm && (
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {!isLoginForm && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {buttonText}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          {isLoginForm 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <Link to={isLoginForm ? "/register" : "/login"} className="font-medium text-purple-600 hover:text-purple-500">
            {isLoginForm ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}

AuthForm.propTypes = {
  formType: PropTypes.oneOf(['login', 'register']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

AuthForm.defaultProps = {
  loading: false,
  error: ''
};

export default AuthForm;