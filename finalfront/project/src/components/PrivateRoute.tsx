import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  redirectTo: string; // Redirect to login if not authenticated
}

export const PrivateRoute = ({ redirectTo }: PrivateRouteProps) => {
  // Check if the user is logged in
  const user = localStorage.getItem('user');
  
  // If there is no user, redirect to the login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If authenticated, render the child components (the protected page)
  return <Outlet />;
};
