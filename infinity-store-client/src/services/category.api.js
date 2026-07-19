import axiosInstance from "../utils/axiosInstance";

export const getCategories = () => axiosInstance.get("/categories");
