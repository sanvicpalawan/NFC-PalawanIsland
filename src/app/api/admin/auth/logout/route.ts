import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set({
    name: "merqato_admin_session",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
