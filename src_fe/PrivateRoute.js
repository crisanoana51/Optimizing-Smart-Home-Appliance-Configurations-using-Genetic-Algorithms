import { Navigate, Outlet } from "react-router-dom";
import React from 'react';

export const PrivateRoute = ({ isAuthenticated, requiredRole, userRole }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && (!userRole || !userRole.includes(requiredRole))) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
