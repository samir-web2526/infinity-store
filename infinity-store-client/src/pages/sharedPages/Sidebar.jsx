import { NavLink } from "react-router";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Products",
      path: "/dashboard/products",
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
    },
    {
      name: "Users",
      path: "/dashboard/users",
    },
    {
      name: "Profile",
      path: "/profile",
    },
    {
      name: "Home",
      path: "/",
    },
  ];

  return (
    <aside className="w-64 border-r bg-white p-5">
      <h2 className="mb-6 text-2xl font-bold text-blue-600">
        Infinity Store
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `block rounded-md px-4 py-2 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}