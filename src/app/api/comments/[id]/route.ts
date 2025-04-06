import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";

const prisma = new PrismaClient();

// PATCH - Update a comment
export async function PATCH(request: NextRequest, { params }) {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const user = authResult;
  const { id } = params;

  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to update this comment" },
        { status: 403 },
      );
    }

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
export async function DELETE(request: NextRequest, { params }) {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const user = authResult;
  const { id } = params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (comment.authorId !== user.id) {
      return NextResponse.json(
        { message: "Not authorized to delete this comment" },
        { status: 403 },
      );
    }

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
