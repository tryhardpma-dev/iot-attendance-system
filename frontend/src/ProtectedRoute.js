import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {
    if (!user) {
        
        return <Navigate to="/auth" />;
    }

    if (requiredRole && user.role_server !== requiredRole) {
       
        return <Navigate to="/" />;
    }

    return children; 
};

export default ProtectedRoute;
