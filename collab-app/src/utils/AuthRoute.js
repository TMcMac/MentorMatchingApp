import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuthRoute = ({ element: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Navigate to='/'/> : <Component {...props}/>
    }
  />
)
export default AuthRoute