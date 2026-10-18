import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Gắn token vào mọi request (nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

declare module "axios" {
  interface InternalAxiosRequestConfig {
    retryCount?: number;
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 400;

// Chỉ thử lại GET (an toàn khi gửi lặp) khi lỗi mạng/timeout hoặc 5xx; bỏ qua request bị huỷ
const shouldRetry = (err: AxiosError) =>
  err.config?.method === "get" &&
  err.code !== AxiosError.ERR_CANCELED &&
  (!err.response || err.response.status >= 500) &&
  (err.config.retryCount ?? 0) < MAX_RETRIES;

// Xử lý lỗi chung
axiosClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401) localStorage.removeItem("token");
    if (err.config && shouldRetry(err)) {
      err.config.retryCount = (err.config.retryCount ?? 0) + 1;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return axiosClient(err.config);
    }
    return Promise.reject(err);
  }
);

export default axiosClient;