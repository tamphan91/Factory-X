import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const url = req.nextUrl.clone();

    url.pathname = isLoggedIn
      ? "/dashboard"
      : "/login";

    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/dashboard") &&
    !isLoggedIn
  ) {
    const url = req.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};