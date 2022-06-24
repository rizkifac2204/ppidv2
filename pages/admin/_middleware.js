import { NextResponse } from "next/server";

export default function middleware(req, res) {
  const { pathname, origin } = req.nextUrl;
  const { eppidV2 } = req.cookies;
  if (!eppidV2) return NextResponse.redirect(`${origin}/login`);

  return NextResponse.next();
}
