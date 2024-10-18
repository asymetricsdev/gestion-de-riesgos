
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  component: JSX.Element;
  isAuthenticated: boolean;
}

const PrivateRoute = ({ component, isAuthenticated }: { component: JSX.Element, isAuthenticated: boolean }) => {
  return isAuthenticated ? component : <Navigate to="/login" />;
};
export default PrivateRoute;
