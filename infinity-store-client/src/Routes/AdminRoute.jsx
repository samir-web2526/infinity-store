import { Navigate, Outlet } from "react-router";

export default function AdminRoute() {
  const isAdmin = false;

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
