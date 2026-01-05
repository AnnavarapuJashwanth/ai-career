import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to guard pages that require authentication
 * Redirects to login if no auth token is found
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Token exists, render the protected component
  return children;
}
