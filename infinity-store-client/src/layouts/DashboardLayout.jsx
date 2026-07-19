import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="border-r bg-white p-4">
        <h2 className="font-semibold">Admin Panel</h2>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
