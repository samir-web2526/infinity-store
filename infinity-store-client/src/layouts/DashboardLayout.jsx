import Sidebar from "@/pages/sharedPages/Sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="flex h-full bg-muted">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}