import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// POST - Create a new comment
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { content, reportId, parentId } = await request.json();

    // Validate required fields
    if (!content || !reportId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 },
      );
    }

    // Verify parent comment exists if provided
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment || parentComment.reportId !== reportId) {
        return NextResponse.json(
          { message: "Invalid parent comment" },
          { status: 400 },
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        reportId,
        authorId: user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            jobTitle: true,
            reputation: true,
          },
        },
      },
    });

    // TODO: Trigger notification to subscribers (to be implemented)

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 },
    );
  }
}
