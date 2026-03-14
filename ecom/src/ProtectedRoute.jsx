

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; 

export const ProtectedRoute = ({
  children,
  adminOnly = false,
  blockAdmin = false,
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  const isPreviewMode = new URLSearchParams(location.search).get('preview') === 'true';

  if (loading) {
    return <div className="pt-40 text-center">Checking access...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (blockAdmin && isAdmin && !isPreviewMode) {
  return <Navigate to="/admin/dashboard" replace />;
}

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};