import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  // Nếu chưa login mà vào /dashboard hoặc /users thì redirect về /login
  if (!token && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/users"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Config: chỉ chạy middleware ở các path này
export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
