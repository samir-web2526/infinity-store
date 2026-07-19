import axiosInstance from "../utils/axiosInstance";

export const getOrders = () => axiosInstance.get("/orders");
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const createOrder = (payload) => axiosInstance.post("/orders", payload);
