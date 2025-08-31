import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/" , children }) => {
  const location = useLocation();
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;