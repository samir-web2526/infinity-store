import { Link } from "react-router";

export default function Register() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="mt-2 text-slate-600">Create a new account.</p>
      <div className="mt-4">
        <Link to="/login" className="text-blue-600 underline">Already have an account?</Link>
      </div>
    </div>
  );
}
