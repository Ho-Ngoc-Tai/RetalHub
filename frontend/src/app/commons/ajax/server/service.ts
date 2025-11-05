/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies, headers } from "next/headers";
import AxiosCommon, { AxiosOptions } from "../Axios";
import { cookiesOption } from "@commons/utils/cookieOption.utils";
import _get from "lodash/get";
import axios from "axios";
import { logger } from "@commons/logger";
import jwt from "jsonwebtoken";
import { CORE_CHECK_REFRESH_TOKEN_ENDPOINT } from "@/routes/coreApi";
import { API_NOT_TOKEN } from "@/routes/apiNotToken";
import { NEXT_LOGOUT_ENDPOINT } from "@/routes/nextApi";
// === Refresh Token State ===
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

class ServiceService extends AxiosCommon {
  constructor(options: AxiosOptions) {
    super(options);

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: any) => {
        const isMatchApiNotToken = API_NOT_TOKEN.includes(config.url);
        if (!isMatchApiNotToken) {
          const uCookies = await cookies();
          let token = uCookies.get(process.env.COOKIE_TOKEN_NAME!)?.value;
          const refreshToken = uCookies.get(process.env.COOKIE_REFRESH_TOKEN_NAME!)?.value;

          if (!token && refreshToken) {
            token = (await refreshTokenHandler(refreshToken)) || undefined;
          }

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Forward headers
        const headerLst = await headers();
        config.headers["User-Agent"] = headerLst.get("User-Agent");
        config.headers["Content-Type"] = "application/json";
        config.headers["address-ip"] = headerLst.get("cf-connecting-ip");
        config.headers["x-forwarded-for"] =
          headerLst.get("x-forwarded-for") || headerLst.get("connection.remoteAddress");

        if (process.env.NODE_ENV !== "production") {
          logger.info(`[REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }

        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        if (process.env.NODE_ENV !== "production") {
          logger.info(`[RESPONSE ${response?.status}] ${JSON.stringify(_get(response, "data"))}`);
        }

        if (response?.data?.code >= 200 && response?.data?.code < 300) {
          return {
            code: response.data.code,
            message: response.data.message,
            success: response.data.success,
            data: response.data?.data?.items || response.data?.data || response.data,
            ...(response?.data?.data?.total && {
              meta: {
                total: response.data.data.total,
                page: response.data.data.page,
                limit: response.data.data.limit,
              },
            }),
          };
        }

        return (
          response.data || {
            code: response?.data?.code || 500,
            message: response?.data?.message || "Unknown error",
            data: response?.data?.data || null,
          }
        );
      },
      async (error: any) => {
        const status = error?.response?.status || error?.status;
        const originalRequest = error.config;

        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const uCookies = await cookies();
          const refreshToken = uCookies.get(process.env.COOKIE_REFRESH_TOKEN_NAME!)?.value;

          if (refreshToken) {
            try {
              const newToken = await refreshTokenHandler(refreshToken);

              if (newToken) {
                // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${newToken}`,
                };
                return this.axiosInstance(originalRequest); // retry request
              }
            } catch (e) {
              // refresh fail → logout
              await clearAuthCookies();
              await logoutAction();
              return Promise.reject(e);
            }
          }
          // refresh token không tồn tại → logout

          await clearAuthCookies();
          // await logoutAction();
          return false;
        }

        if (process.env.NODE_ENV !== "production") {
          logger.error(`[ERROR ${status}] ${error?.message} - ${error?.config?.url}`);
        }

        return Promise.reject({
          code: status || error.code || 500,
          message: error.message,
          data: error?.response?.data,
        });
      }
    );
  }
}

// ==== Helpers ====

async function clearAuthCookies() {
  const uCookies = await cookies();
  uCookies.set(process.env.COOKIE_TOKEN_NAME!, "", cookiesOption(0));
  uCookies.set(process.env.COOKIE_REFRESH_TOKEN_NAME!, "", cookiesOption(0));
}

// Quản lý refresh token 1 lần duy nhất
async function refreshTokenHandler(refreshToken: string): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });
  }

  isRefreshing = true;
  try {
    const newToken = await refreshTokenAction(refreshToken);
    onRefreshed(newToken);
    return newToken;
  } catch {
    onRefreshed(null);
    return null;
  } finally {
    isRefreshing = false;
  }
}

async function refreshTokenAction(refreshToken: string): Promise<string | null> {
  try {
    const useCoookies = await cookies();
    const headerLst = await headers();
    const respToken = await axios.post(
      `${process.env.CORE_API_DOMAIN}/${CORE_CHECK_REFRESH_TOKEN_ENDPOINT}`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": headerLst.get("User-Agent"),
          "address-ip": headerLst.get("cf-connecting-ip"),
          "x-forwarded-for": headerLst.get("x-forwarded-for") || headerLst.get("connection.remoteAddress"),
        },
      }
    );

    if (respToken?.data?.data?.accessToken) {
      // update cookie
      const tokenDecoded = jwt.decode(String(respToken?.data?.data?.accessToken));

      const tokenIat =
        typeof tokenDecoded === "object" && tokenDecoded !== null ? (tokenDecoded as jwt.JwtPayload).iat : undefined;
      const tokenExp =
        typeof tokenDecoded === "object" && tokenDecoded !== null ? (tokenDecoded as jwt.JwtPayload).exp : undefined;
      useCoookies.set(
        process.env.COOKIE_TOKEN_NAME!,
        String(respToken?.data?.data?.accessToken),
        cookiesOption(tokenExp && tokenIat ? (tokenExp - tokenIat) * 1000 : undefined) as any
      );

      const refreshTokenDecoded = jwt.decode(String(respToken?.data?.data?.refreshToken));
      const refreshIat =
        typeof refreshTokenDecoded === "object" && refreshTokenDecoded !== null
          ? (refreshTokenDecoded as jwt.JwtPayload).iat
          : undefined;
      const refreshExp =
        typeof refreshTokenDecoded === "object" && refreshTokenDecoded !== null
          ? (refreshTokenDecoded as jwt.JwtPayload).exp
          : undefined;

      useCoookies.set(
        process.env.COOKIE_REFRESH_TOKEN_NAME!,
        String(respToken?.data?.data?.refreshToken),
        cookiesOption(refreshExp && refreshIat ? (refreshExp - refreshIat) * 1000 : undefined)
      );
      // await checkRefreshToken(respToken.data); // cập nhật lại cookie/token trong hệ thống
      return respToken.data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

async function logoutAction() {
  try {
    const headerLst = await headers();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const endpoint = `${baseUrl}/api${NEXT_LOGOUT_ENDPOINT}`;
    await axios.post(
      endpoint,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": headerLst.get("User-Agent"),
          "address-ip": headerLst.get("cf-connecting-ip"),
          "x-forwarded-for": headerLst.get("x-forwarded-for") || headerLst.get("connection.remoteAddress"),
        },
      }
    );
  } catch (error) {
    console.error("logout error:", error);
  }
}

// async function checkRefreshToken(oauthToken: object | undefined) {
//   try {
//     const headerLst = await headers();
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const checkCookieEndPoint = `${baseUrl}/api${NEXT_REFRESH_TOKEN_ENDPOINT}`;
//     return await axios.post(checkCookieEndPoint, oauthToken, {
//       headers: {
//         "Content-Type": "application/json",
//         "User-Agent": headerLst.get("User-Agent"),
//         "address-ip": headerLst.get("cf-connecting-ip"),
//         "x-forwarded-for": headerLst.get("x-forwarded-for") || headerLst.get("connection.remoteAddress"),
//       },
//     });
//   } catch {
//     return null;
//   }
// }

export default ServiceService;
