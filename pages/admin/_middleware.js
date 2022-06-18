import { NextResponse } from "next/server";

export default function middleware(req, res) {
  const { eppidV2 } = req.cookies;
  if (!eppidV2) return NextResponse.redirect(`${process.env.HOST}/login`);
}
