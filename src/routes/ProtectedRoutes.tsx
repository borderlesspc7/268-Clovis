import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { paths } from "./paths";
import type { ReactNode } from "react";

interface ProtectedRoutesProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRoutesProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to={paths.login} replace />;

  return <>{children}</>;
};
