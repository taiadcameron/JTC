// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/clubs/new") ||
    request.nextUrl.pathname.includes("/edit");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clubs/new", "/clubs/:path*/edit"],
};
