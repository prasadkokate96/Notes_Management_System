import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ redirectPath }) {
  const { currentUser, loading, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Show error message if there's an authentication error
  if (error) {
    return (
      <div className="auth-error">
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <Navigate to="/login" state={{ from: location }} replace />
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!currentUser) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected route content
  return <Outlet />;
}

ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string
};

ProtectedRoute.defaultProps = {
  redirectPath: '/login'
};

export default ProtectedRoute;