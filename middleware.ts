import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  //gets users auth token
  const token = await getToken({ req: request });

  //checks if route is protected
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/clubs/new") ||
    request.nextUrl.pathname.includes("/edit");

  //not protected go to sign in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/clubs/new", "/clubs/:path*/edit"],
};
