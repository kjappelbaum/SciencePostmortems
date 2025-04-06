import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  // Clear the authentication cookie
  clearAuthCookie();

  return NextResponse.json({ message: "Logged out successfully" });
}
