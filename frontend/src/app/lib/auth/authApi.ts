// src/app/lib/authApi.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";
const api = axios.create({
  baseURL: `${API_BASE}`, // backend route root
  withCredentials: true,      // để gửi/nhận cookie (refresh token)
});

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try { localStorage.setItem("accessToken", token); } catch {}
  } else {
    delete api.defaults.headers.common["Authorization"];
    try { localStorage.removeItem("accessToken"); } catch {}
  }
}

/** Types */
export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  user: { id: string; email: string };
}

/** API calls */
export const loginApi = (payload: LoginPayload) => api.post<LoginResponse>("/auth/login", payload);
export const logoutApi = () => api.post("/auth/logout");
export const refreshApi = () => api.post<{ accessToken: string }>("/auth/refresh");
export const meApi = () => api.get<LoginResponse>("/auth/me");

/**
 * Optional: auto-refresh on 401 (basic pattern)
 * - tránh infinite loop bằng flag _retry
 */
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const r = await refreshApi(); // backend trả accessToken mới
        const newAccess = r.data.accessToken;
        setAuthToken(newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api.request(originalRequest);
      } catch (e) {
        setAuthToken(null);
        // fallback: redirect to login trên client hoặc return reject
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
