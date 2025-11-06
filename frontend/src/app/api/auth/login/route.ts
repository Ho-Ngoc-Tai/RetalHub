/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { post } from "@commons/ajax/server";
import { cookiesOption } from "@commons/utils/cookieOption.utils";
import { CORE_LOGIN_ENDPOINT } from "@/routes/coreApi";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    console.log("[NEXT API] /api/auth/login called");
    const body = (await req.json()) as {
      username?: string;
      email?: string;
      password?: string;
      [key: string]: unknown;
    };

    const rawEmail = (body.email ?? body.username)?.toString().trim().toLowerCase();
    const password = body.password?.toString() ?? "";

    if (!rawEmail || !password) {
      console.warn("[NEXT API] Missing email or password", body);
      return Response.json(
        {
          success: false,
          message: "EMAIL_OR_PASSWORD_REQUIRED",
          data: null,
          code: 400,
        },
        { status: 400 }
      );
    }

    console.log("[NEXT API] Forwarding to CORE API", {
      endpoint: CORE_LOGIN_ENDPOINT,
      email: rawEmail,
    });
    const resp: any = await post(CORE_LOGIN_ENDPOINT, {
      email: rawEmail,
      password,
    });

    if (!resp) {
      console.error("[NEXT API] No response from CORE API");
      return Response.json(
        {
          success: false,
          message: "NO_RESPONSE_FROM_CORE",
          data: null,
          code: 502,
        },
        { status: 502 }
      );
    }

    if (resp === false) {
      console.warn("[NEXT API] CORE API returned false (likely unauthorized)");
      return Response.json(
        {
          success: false,
          message: "INVALID_CREDENTIALS",
          data: null,
          code: 401,
        },
        { status: 401 }
      );
    }

    const useCookies = await cookies();

    if (resp?.code === 200) {
      const token = String(resp?.data?.accessToken ?? "");
      const refreshToken = String(resp?.data?.refreshToken ?? "");

      if (token) {
        console.log("[NEXT API] Setting access token cookie");
        const tokenDecoded = jwt.decode(token);
        const tokenIat =
          typeof tokenDecoded === "object" && tokenDecoded !== null
            ? (tokenDecoded as jwt.JwtPayload).iat
            : undefined;
        const tokenExp =
          typeof tokenDecoded === "object" && tokenDecoded !== null
            ? (tokenDecoded as jwt.JwtPayload).exp
            : undefined;

        useCookies.set(
          process.env.COOKIE_TOKEN_NAME!,
          token,
          cookiesOption(tokenExp && tokenIat ? (tokenExp - tokenIat) * 1000 : undefined) as any
        );
      }

      if (refreshToken) {
        console.log("[NEXT API] Setting refresh token cookie");
        const refreshTokenDecoded = jwt.decode(refreshToken);
        const refreshIat =
          typeof refreshTokenDecoded === "object" && refreshTokenDecoded !== null
            ? (refreshTokenDecoded as jwt.JwtPayload).iat
            : undefined;
        const refreshExp =
          typeof refreshTokenDecoded === "object" && refreshTokenDecoded !== null
            ? (refreshTokenDecoded as jwt.JwtPayload).exp
            : undefined;

        useCookies.set(
          process.env.COOKIE_REFRESH_TOKEN_NAME!,
          refreshToken,
          cookiesOption(refreshExp && refreshIat ? (refreshExp - refreshIat) * 1000 : undefined) as any
        );
      }
    }

    const status = typeof resp?.code === "number" ? resp.code : 200;
    console.log("[NEXT API] Returning response", { status, success: resp?.success, code: resp?.code });
    return Response.json(resp, { status });
  } catch (error: any) {
    const status = typeof error?.code === "number" ? error.code : 500;
    console.error("[NEXT API] Login handler error", { error, status });
    return Response.json(
      {
        success: false,
        message: error?.message ?? "LOGIN_FAILED",
        data: error?.data ?? null,
        code: status,
      },
      { status }
    );
  }
}
