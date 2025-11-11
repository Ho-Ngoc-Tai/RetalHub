import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const parseHostsFromEnv = (value?: string | null) => {
  if (!value) return [] as { host: string; hostname: string }[];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      try {
        const parsed = item.includes(":" ) && !item.includes("//") ? new URL(`http://${item}`) : new URL(item);
        return { host: parsed.host, hostname: parsed.hostname };
      } catch {
        const [hostnamePart] = item.split(":");
        return { host: item, hostname: hostnamePart ?? item };
      }
    });
};


export function middleware(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const allowedHostEnv = process.env.NEXT_PUBLIC_ALLOWED_HOST ?? process.env.NEXT_PUBLIC_ALLOWED_HOSTS;
  const fallbackHostsSource = baseUrl ? (() => {
    try {
      return new URL(baseUrl).host;
    } catch {
      return "";
    }
  })() : "";

  const parsedAllowedHosts = parseHostsFromEnv(allowedHostEnv);
  const fallbackHosts = parsedAllowedHosts.length ? [] : parseHostsFromEnv(fallbackHostsSource);

  const allowedHosts = [
    ...parsedAllowedHosts,
    ...fallbackHosts,
  ];

  const requestHost = req.headers.get("host");
  const requestHostname = requestHost?.split(":")[0];

  console.log("[middleware] allowedHosts", allowedHosts);
  console.log("[middleware] requestHost", requestHost);

  if (allowedHosts.length && requestHost) {
    const isAllowed = allowedHosts.some(({ host, hostname }) => host === requestHost || hostname === requestHostname);
    if (!isAllowed) {
      console.log("[middleware] blocked host", requestHost);
      return new NextResponse("Access Denied: Invalid Host", { status: 403 });
    }
  }

  const tokenCookieName = process.env.COOKIE_TOKEN_NAME || "token";
  const token = req.cookies.get(tokenCookieName)?.value || null;
  console.log("[middleware] token", token ? "present" : "missing");
  const protectedPaths = ["/dashboard", "/users"];

  if (!token && protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
