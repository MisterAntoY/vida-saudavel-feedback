import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const protectedRoutes = [
  "/dashboard",
  "/questionario",
  "/relatorios",
  "/departamentos",
  "/usuarios",
  "/configuracoes",
];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return response;

  const hasAuthCookie =
    request.cookies.get("sb-access-token") ||
    request.cookies
      .getAll()
      .some((cookie) => cookie.name.includes("supabase") || cookie.name.includes("sb-"));

  if (!hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};