import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (user?.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}