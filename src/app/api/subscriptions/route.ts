import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - List user's subscriptions
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
      },
      include: {
        report: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}

// POST - Create a new subscription
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { reportId, categoryId } = await request.json();

    // Validate input - must have either reportId or categoryId but not both
    if ((!reportId && !categoryId) || (reportId && categoryId)) {
      return NextResponse.json(
        { message: "Must provide either reportId or categoryId, but not both" },
        { status: 400 },
      );
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        OR: [
          { reportId: reportId || null },
          { categoryId: categoryId || null },
        ],
      },
    });

    if (existingSubscription) {
      return NextResponse.json({
        message: "Already subscribed",
        subscription: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        reportId: reportId || null,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(
      {
        message: "Subscription created successfully",
        subscription,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a subscription
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 },
      );
    }

    // Check if subscription exists and belongs to user
    const subscription = await prisma.subscription.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 },
      );
    }

    // Delete subscription
    await prisma.subscription.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { message: "Failed to delete subscription" },
      { status: 500 },
    );
  }
}
