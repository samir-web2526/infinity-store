import axiosInstance from "../utils/axiosInstance";

export const getUsers = () => axiosInstance.get("/users");
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
