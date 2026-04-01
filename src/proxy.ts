import { auth } from "@/lib/auth"

export const proxy = auth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/sales/:path*",
    "/purchases/:path*",
    "/warranty/:path*",
    "/customers/:path*",
    "/employees/:path*",
    "/expenses/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
}
