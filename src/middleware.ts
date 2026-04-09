import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = ["/dashboard", "/products", "/reports", "/clientes", "/register"];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      
      // Redirige a página de no autorizado si no hay token
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

// Rutas que aplica
export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/reports/:path*", "/clientes/:path*", "/register/:path*"],
};
