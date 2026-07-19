import axiosInstance from "../utils/axiosInstance";

export const getProducts = () => axiosInstance.get("/products");
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
