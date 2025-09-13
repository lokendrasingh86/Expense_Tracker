import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectRoute;
