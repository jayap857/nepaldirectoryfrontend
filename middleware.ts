import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-prod"
);
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "access_token";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/business/create",
  "/my-reviews",
  "/my-businesses",
];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value ?? null;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r));
  const isAuth = authRoutes.some((r) => pathname.startsWith(r));

  const user = token ? await verifyToken(token) : null;

  if (isAdmin) {
    if (!user || !user.is_staff) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      loginUrl.searchParams.set("message", "admin_required");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && user) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/business/create/:path*",
    "/my-reviews/:path*",
    "/my-businesses/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
  runtime: "nodejs", // 👈 add this if you’re using process.env
};
