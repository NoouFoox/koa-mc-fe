import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 0,
});
http.interceptors.request.use((config) => {
  config.data = {
    slat: import.meta.env.VITE_API_SLAT,
    ...(config?.data || {}),
  };
  return config;
});
http.interceptors.response.use((config) => {
  return config.data;
});
export default http;
