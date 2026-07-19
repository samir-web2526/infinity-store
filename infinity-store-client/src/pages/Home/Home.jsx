import { Link } from "react-router";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-2 text-slate-600">Welcome to Infinity Store.</p>
      <div className="mt-4 flex gap-4">
        <Link to="/products" className="text-blue-600 underline">Browse products</Link>
        <Link to="/login" className="text-blue-600 underline">Login</Link>
      </div>
    </div>
  );
}
