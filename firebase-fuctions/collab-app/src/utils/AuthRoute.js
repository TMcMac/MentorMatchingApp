import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ authenticated }) => {
      return authenticated === true ? <Navigate to='/' /> : <Outlet/>;
    }

export default AuthRoute