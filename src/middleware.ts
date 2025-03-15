import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get("auth-token");

  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      // Redirect to login if there's no token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
