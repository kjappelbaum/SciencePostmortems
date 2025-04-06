import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Clear the authentication cookie
  clearAuthCookie();

  return NextResponse.json({ message: "Logged out successfully" });
}
