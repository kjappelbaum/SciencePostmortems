import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    slug: string;
  };
}

// GET - Get a single report by slug
export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { slug } = params;

    // Get the report with related data
    const report = await prisma.report.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            jobTitle: true,
            fieldOfStudy: true,
            reputation: true,
            createdAt: true,
          },
        },
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                jobTitle: true,
                reputation: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 },
      );
    }

    // Increment view count
    await prisma.report.update({
      where: { id: report.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { message: "Failed to fetch report" },
      { status: 500 },
    );
  }
}

// PATCH - Update a report
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { slug } = params;
    const { title, description, reason, learning } = await request.json();

    // Find the report
    const report = await prisma.report.findUnique({
      where: { slug },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 },
      );
    }

    // Check if the user is the author
    if (report.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to update this report" },
        { status: 403 },
      );
    }

    // Update the report
    const updatedReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        title: title || undefined,
        description: description || undefined,
        reason: reason || undefined,
        learning: learning || undefined,
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { message: "Failed to update report" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { slug } = params;

    // Find the report
    const report = await prisma.report.findUnique({
      where: { slug },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 },
      );
    }

    // Check if the user is the author
    if (report.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to delete this report" },
        { status: 403 },
      );
    }

    // Delete the report
    await prisma.report.delete({
      where: { id: report.id },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { message: "Failed to delete report" },
      { status: 500 },
    );
  }
}
