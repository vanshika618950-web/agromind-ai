import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-agro-700 to-agro-500 flex items-center justify-center text-white shadow-glow animate-bounce">
          <Sprout className="w-8 h-8" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600">
          Loading AgroMind Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
