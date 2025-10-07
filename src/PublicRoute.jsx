import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? <Navigate to="/client-details" replace /> : children;
};

export default PublicRoute;
