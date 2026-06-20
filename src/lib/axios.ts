import axios from "axios";
import { baseURL } from "@/config/constants";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401 && error.response.data.message !== "The email or password you entered is incorrect.") {
      const hadAdminToken = !!localStorage.getItem("admin_token");

      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");

      window.location.href = hadAdminToken ? "/auth/admin" : "/auth/signin";
    }

    return Promise.reject(error);
  }
);

export default api;
