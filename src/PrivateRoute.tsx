import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from './RoleContext';

const PrivateRoute: React.FC = () => {
  const { userId } = useRole();

  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;