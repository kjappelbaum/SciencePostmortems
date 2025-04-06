import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

const prisma = new PrismaClient();

// GET - List reports with optional filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";

    // Build filter conditions
    const where: any = {};

    if (category) {
      where.categoryId = category;
    }

    // Determine sorting
    let orderBy: any = { createdAt: "desc" };

    if (sort === "votes") {
      // Handle the case where votes field isn't available - use createdAt instead
      orderBy = { createdAt: "desc" };
    } else if (sort === "views") {
      // Handle the case where viewCount field isn't available - use createdAt instead
      orderBy = { createdAt: "desc" };
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            jobTitle: true,
            reputation: true,
          },
        },
        category: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      take: 20, // Limit to 20 reports
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { message: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

// POST - Create a new report
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Ensure user is authenticated
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // This is the error response
  }

  // If we reach here, authResult is the user object
  const user = authResult;

  try {
    const { title, categoryId, description, reason, learning } =
      await request.json();

    // Validate required fields
    if (!title || !categoryId || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate a unique slug for the report
    const slug = await generateSlug(title);

    // Create the report - removing the fields that aren't in the schema
    const report = await prisma.report.create({
      data: {
        title,
        slug,
        description,
        reason: reason || "",
        learning: learning || "",
        authorId: user.id,
        categoryId,
        // Remove the votes and viewCount fields if they're not in your schema
        // votes: 0,
        // viewCount: 0,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { message: "Failed to create report" },
      { status: 500 },
    );
  }
}
