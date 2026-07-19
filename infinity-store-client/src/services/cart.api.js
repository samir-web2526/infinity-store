import axiosInstance from "../utils/axiosInstance";

export const getCart = () => axiosInstance.get("/cart");
export const addToCart = (payload) => axiosInstance.post("/cart", payload);
export const updateCartItem = (id, payload) => axiosInstance.put(`/cart/${id}`, payload);
export const removeCartItem = (id) => axiosInstance.delete(`/cart/${id}`);
