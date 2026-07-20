import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

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
import AdminProducts from "../pages/Dashboard/AdminProducts";
import AdminProductDetails from "@/pages/Dashboard/AdminProductDetails";
import NotFound from "../pages/Error/NotFound";
import AdminCategories from "@/pages/Dashboard/AdminCategories";
import AdminOrders from "@/pages/Dashboard/AdminOrders";
import AdminOrderDetails from "@/pages/Dashboard/AdminOrderDetails";
import AdminUsers from "@/pages/Dashboard/AdminUsers";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
        children: [
          {
            path: ":id",
            element: <ProductDetails />,
          },
        ],
      },
    ],
  },

  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // Protected Routes
  {
    element: <PrivateRoute />,
    children: [
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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },

      // Admin Routes
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <AdminRoute><AdminDashboard /></AdminRoute>,
          },
          {
            path: "products",
            element: <AdminRoute><AdminProducts /></AdminRoute>,
          },
          {
            path: "products/:id",
            element: <AdminRoute><AdminProductDetails /></AdminRoute>,
          },
          {
            path: "categories",
            element: <AdminRoute><AdminCategories /></AdminRoute>,
          },
          {
            path: "orders",
            element: <AdminRoute><AdminOrders /></AdminRoute>,
          },
          {
            path: "orders/:id",
            element: <AdminRoute><AdminOrderDetails /></AdminRoute>,
          },
          {
            path: "users",
            element: <AdminRoute><AdminUsers /></AdminRoute>,
          }

        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;