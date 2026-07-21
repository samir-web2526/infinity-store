import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="p-6">
      <Helmet>
        <title>404 - Page Not Found | Infinity Store</title>
      </Helmet>

      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
    </div>
  );
}
