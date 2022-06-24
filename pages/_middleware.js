import { NextResponse } from "next/server";

export default function middleware(req, res) {
  const { pathname, origin } = req.nextUrl;
  const { eppidV2 } = req.cookies;
  if (eppidV2 && req.nextUrl.pathname === "/login")
    return NextResponse.redirect(`${origin}/admin`);

  return NextResponse.next();
}
