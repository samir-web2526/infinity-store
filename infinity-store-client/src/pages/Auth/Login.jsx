import { Link } from "react-router";

export default function Login() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="mt-2 text-slate-600">Sign in to your account.</p>
      <div className="mt-4">
        <Link to="/register" className="text-blue-600 underline">Create an account</Link>
      </div>
    </div>
  );
}
