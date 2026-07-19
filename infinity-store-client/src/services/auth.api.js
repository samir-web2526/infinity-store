import axiosInstance from "../utils/axiosInstance";

export const loginUser = (payload) => axiosInstance.post("/auth/login", payload);
export const registerUser = (payload) => axiosInstance.post("/auth/register", payload);
export const getProfile = () => axiosInstance.get("/auth/me");
