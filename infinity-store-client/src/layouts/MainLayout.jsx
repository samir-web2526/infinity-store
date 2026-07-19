import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white p-4">
        <h1 className="text-lg font-semibold">Infinity Store</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
