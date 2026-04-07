export { auth as middleware } from "@/lib/auth"

export const runtime = "nodejs"

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