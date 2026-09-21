import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/constants';
import { LoadingSkeleton } from '../components/feedback/LoadingSkeleton';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-canvas">
        <div className="w-full max-w-sm space-y-4">
          <LoadingSkeleton variant="circle" className="w-12 h-12 mx-auto" />
          <LoadingSkeleton variant="text" className="h-6 w-48 mx-auto" />
          <LoadingSkeleton variant="rect" className="h-20" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
