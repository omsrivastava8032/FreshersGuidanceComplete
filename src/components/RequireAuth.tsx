// src/components/RequireAuth.tsx
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children, role }: { children: JSX.Element, role?: string }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}