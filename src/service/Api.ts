import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/";

export const getBaseUrl = (): string => {
  const storedUrl = localStorage.getItem("API_BASE_URL");
  if (
    storedUrl === "https://task-list.ch/api/" ||
    storedUrl === "http://192.168.1.169:8080/api/"
  ) {
    localStorage.removeItem("API_BASE_URL");
    return DEFAULT_BASE_URL;
  }
  return storedUrl || DEFAULT_BASE_URL;
};

export const setBaseUrl = (url: string) => {
  let formattedUrl = url.trim();
  if (formattedUrl && !formattedUrl.endsWith("/")) {
    formattedUrl += "/";
  }
  localStorage.setItem("API_BASE_URL", formattedUrl);
  TaskApi.defaults.baseURL = formattedUrl;
};

export const TaskApi: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const security = false;

TaskApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    config.baseURL = getBaseUrl();
    config.withCredentials = true;
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
