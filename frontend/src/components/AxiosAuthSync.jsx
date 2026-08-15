import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "../lib/axios";

const AxiosAuthSync = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptorId);
    };
  }, [getToken]);

  return null;
};

export default AxiosAuthSync;