import { Link, useParams } from "react-router";

export default function OrderDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Order Details</h1>
      <p className="mt-2 text-slate-600">Viewing order #{id}</p>
      <div className="mt-4">
        <Link to="/orders" className="text-blue-600 underline">Back to orders</Link>
      </div>
    </div>
  );
}
