import axiosSecure from "../utils/axiosSecure";

export const getOrders = async () => {
  const { data } = await axiosSecure.get("/orders");
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axiosSecure.get(`/orders/${id}`);
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await axiosSecure.post("/orders", payload);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await axiosSecure.patch(`/orders/${id}/cancel`);
  return data;
};

export const getAllOrders = async () => {
  const { data } = await axiosSecure.get("/orders/all");
  return data;
};

export const updateOrderStatus = async (id, payload) => {
  const { data } = await axiosSecure.patch(`/orders/${id}/status`, payload);
  return data;
};
