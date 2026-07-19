import { useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";

export function useAxios() {
  return useMemo(() => axiosInstance, []);
}
