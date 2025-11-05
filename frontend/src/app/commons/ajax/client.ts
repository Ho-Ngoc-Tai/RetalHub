import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
});

export function setAuthHeader(token?: string | null) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

export function post<T = unknown, R = unknown>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig<T>,
): Promise<AxiosResponse<R>> {
  return client.post<R>(url, data, config);
}

export default client;
