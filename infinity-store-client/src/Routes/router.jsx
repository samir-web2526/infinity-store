import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import MyOrders from "../pages/Orders/MyOrders";
import OrderDetails from "../pages/Orders/OrderDetails";
import Profile from "../pages/Profile/Profile";
import ChangePassword from "../pages/Profile/ChangePassword";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import NotFound from "../pages/Error/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/orders",
    element: <MyOrders />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
