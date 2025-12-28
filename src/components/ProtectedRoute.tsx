import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { useLogin } from '../context/LoginContext';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  // const { isAuthenticated } = useAuth();
  const { isAuthenticated } = useLogin();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};