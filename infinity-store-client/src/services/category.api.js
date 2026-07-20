import axiosPublic from "../utils/axiosPublic";

export const getCategories = async () => {
  const { data } = await axiosPublic.get("/categories");
  return data;
};
