import { NextResponse } from "next/server";
import { adminCookieName, getAdminCredentials } from "@/lib/adminAuth";

export async function POST(request) {
  const body = await request.json();
  const credentials = getAdminCredentials();

  if (!credentials.password || body.email !== credentials.email || body.password !== credentials.password) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
