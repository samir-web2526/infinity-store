import { Link, useParams } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Product Details</h1>
      <p className="mt-2 text-slate-600">Viewing product #{id}</p>
      <div className="mt-4">
        <Link to="/products" className="text-blue-600 underline">Back to products</Link>
      </div>
    </div>
  );
}
