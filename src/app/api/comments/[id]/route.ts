import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH - Update a comment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { id } = params;
    const { content } = await request.json();

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 },
      );
    }

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    // Check if the user is the author
    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to update this comment" },
        { status: 403 },
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { message: "Failed to update comment" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { id } = params;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    // Check if the user is the author
    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to delete this comment" },
        { status: 403 },
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
