// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//     const user = useSelector((state) => state.auth.user);

//     if (!user) {
//         // if user is not got direct it to login page
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// }

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user"); // 👈 persist login across tabs
  return storedUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
