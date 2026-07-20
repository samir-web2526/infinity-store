import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useCart = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await axios.get("/cart");
      return data;
    },
  });
};

export default useCart;