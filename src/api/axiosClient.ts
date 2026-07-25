import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api
          .post("/api/auth/refresh", {
            refreshToken: localStorage.getItem("refreshToken"),
          })
          .then((r) => r.data.accessToken as string)
          .catch(() => null)
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newAccess = await refreshPromise;
      if (newAccess) {
        localStorage.setItem("accessToken", newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
