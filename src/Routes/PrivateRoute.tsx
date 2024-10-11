
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  component: JSX.Element;
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component, isAuthenticated }) => {
  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default PrivateRoute;
