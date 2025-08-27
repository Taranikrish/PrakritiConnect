import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate dashboard
  // Allow volunteers to view organization dashboards (routes with orgId parameter)
  if (requiredRole && user?.role !== requiredRole) {
    // Special case: allow volunteers to view organization dashboards (but not create events)
    const currentPath = window.location.pathname;
    const isOrganizationDashboardView = currentPath.startsWith('/organizer-dashboard/') && currentPath !== '/organizer-dashboard';
    
    if (isOrganizationDashboardView && user?.role === 'volunteer') {
      // Allow volunteers to view organization dashboards
      return children;
    }
    
    // For all other cases, redirect based on user role
    if (user?.role === 'organizer') {
      return <Navigate to={`/organizer-dashboard/${user?.uid}`} replace />;
    } else if (user?.role === 'volunteer') {
      return <Navigate to="/volunteer-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
