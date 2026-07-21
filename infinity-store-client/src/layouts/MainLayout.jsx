import { Outlet } from "react-router";
import Navbar from "@/pages/sharedPages/Navbar";
export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Navbar />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}