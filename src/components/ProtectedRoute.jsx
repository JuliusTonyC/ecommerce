// ProtectedRoute.jsx

// You need this to prevent anyone from just accessing the dashboard just like that without authentication e.g. a user using https.../dashboard to get into the dashboard without 

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;