import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken, hashPassword, setAuthCookie } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password, jobTitle, fieldOfStudy } = await request.json();

    // Validate inputs
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { message: "Valid email and password (minimum 8 characters) required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        jobTitle: jobTitle || undefined,
        fieldOfStudy: fieldOfStudy || undefined,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Set authentication cookie
    await setAuthCookie(token);

    // Return success without exposing sensitive data
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 },
    );
  }
}
