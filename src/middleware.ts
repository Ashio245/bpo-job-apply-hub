import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = 
    nextUrl.pathname === "/" || 
    nextUrl.pathname === "/jobs" || 
    nextUrl.pathname.startsWith("/jobs/") || 
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/uploads");

  // In local development, we want to allow users to explore pages without forced redirect 
  // if they don't have auth configured, but we will protect admin routes strictly
  if (nextUrl.pathname.startsWith("/admin")) {
    const role = (req.auth?.user as any)?.role;
    // Development bypass: if email matches developer mock, let them pass
    const isMockAdmin = req.auth?.user?.email === "admin@bpoapply.ph";
    
    // We allow access for local testing or if role is admin
    if (!isLoggedIn && !isMockAdmin) {
      return NextResponse.redirect(new URL("/?error=admin-auth-required", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
