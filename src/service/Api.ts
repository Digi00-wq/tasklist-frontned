import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

const BASE_URL = "http://192.168.1.169:8080/api/";

export const TaskApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});

const security = false;

TaskApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (!security) {
      return config;
    }
    const token = localStorage.getItem("token");
    const correctPath: boolean =
      config.url !== "login" && config.url !== "register";
    if (token && correctPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
