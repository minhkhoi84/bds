import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 2;
const RETRY_DELAY = 400;

declare module "axios" {
  interface AxiosRequestConfig {
    // Số lần retry khi timeout, bật theo từng request (mặc định 0 = không retry)
    retryOnTimeout?: number;
  }
}

type RetryConfig = InternalAxiosRequestConfig & { _retryCount?: number; _timeoutRetryCount?: number };

// Request dữ liệu bộ lọc: backend UAT đôi khi chậm nên chờ lâu hơn và thử lại 1 lần khi timeout
export const LOOKUP_REQUEST = { timeout: 15000, retryOnTimeout: 1 } as const;

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

const isTimeout = (err: AxiosError) => err.code === "ECONNABORTED" || err.code === "ETIMEDOUT";

// Chỉ retry GET. Request bị hủy: không retry.
// Timeout: chỉ retry khi request bật retryOnTimeout. Lỗi mạng (không có response) hoặc 5xx: tối đa MAX_RETRIES.
function shouldRetry(err: AxiosError): boolean {
  const config = err.config as RetryConfig | undefined;
  if (!config || config.method?.toLowerCase() !== "get") return false;
  if (axios.isCancel(err)) return false;
  if (isTimeout(err)) return (config._timeoutRetryCount ?? 0) < (config.retryOnTimeout ?? 0);
  if ((config._retryCount ?? 0) >= MAX_RETRIES) return false;
  const status = err.response?.status;
  return status === undefined || status >= 500;
}

// Xử lý lỗi chung
axiosClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401) localStorage.removeItem("token");
    if (shouldRetry(err)) {
      const config = err.config as RetryConfig;
      if (isTimeout(err)) config._timeoutRetryCount = (config._timeoutRetryCount ?? 0) + 1;
      else config._retryCount = (config._retryCount ?? 0) + 1;
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return axiosClient(config);
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
