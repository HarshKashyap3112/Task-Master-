import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    // If not logged in, kick them back to Home (Login)
    return <Navigate to="/" replace />;
  }
  // If logged in, show the Dashboard
  return children;
};