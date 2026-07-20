import axiosPublic from "../utils/axiosPublic";

export const getProducts = async (params = {}) => {
  const { data } = await axiosPublic.get("/products", { params });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axiosPublic.get(`/products/${id}`);
  return data;
};
