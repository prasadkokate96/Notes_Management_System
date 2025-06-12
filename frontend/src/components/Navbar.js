import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="ml-2 text-white font-bold text-xl">Notes App</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/notes/new" 
                  className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  New Note
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-200"
                >
                  Sign out
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-800 text-white">
                      <span className="text-sm font-medium leading-none">
                        {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;