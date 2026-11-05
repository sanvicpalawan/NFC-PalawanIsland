import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set({
    name: "nfc_palawan_admin_session",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return res;
}
