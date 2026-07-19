import { Link } from "react-router";

export default function Products() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <ul className="mt-4 space-y-2">
        <li><Link to="/products/1" className="text-blue-600 underline">Product 1</Link></li>
        <li><Link to="/products/2" className="text-blue-600 underline">Product 2</Link></li>
      </ul>
    </div>
  );
}
