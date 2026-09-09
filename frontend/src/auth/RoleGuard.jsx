import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleGuard = ({ allowedRoles = [], children, fallback }) => {
  const { hasRole, user } = useAuth();

  if (!hasRole(...allowedRoles)) {
    if (fallback) return <>{fallback}</>;
    if (user?.role === 'CUSTOMER' || user?.role === 'DRIVER') {
      return <Navigate to="/orders" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
