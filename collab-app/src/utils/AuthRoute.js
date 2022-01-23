import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ element: Component, authenticated, ...rest }) => {
  return authenticated ? <Navigate to='/'/> : <Outlet />;
};
export default AuthRoute