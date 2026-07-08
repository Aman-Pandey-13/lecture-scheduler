import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/lib/types";

interface ProtectedRouteProps {
  role: Role;
}

/** Home dashboard for a given role. */
export function dashboardPathFor(role: Role): string {
  return role === "Admin" ? "/admin" : "/instructor";
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const location = useLocation();
  const { token, user } = useAuthStore();

  // Not authenticated → send to login, remembering where they wanted to go.
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated but wrong role → send to their own dashboard.
  if (user.role !== role) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }

  return <Outlet />;
}
