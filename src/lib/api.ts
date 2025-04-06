import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Report {
  id: string;
  title: string;
  slug: string;
  date: Date;
  excerpt?: string;
  content?: string;
  authorId: string;
  author: {
    jobTitle?: string | null;
  };
  category: Category;
  _count: {
    comments: number;
  };
  createdAt: Date;
}

/**
 * Get a specific category by slug
 */
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    return category;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Get reports for a specific category
 */
export async function getCategoryReports(
  categorySlug: string,
): Promise<Report[]> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true },
    });

    if (!category) {
      return [];
    }

    const reports = await prisma.report.findMany({
      where: {
        categoryId: category.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            jobTitle: true,
          },
        },
        category: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return reports;
  } catch (error) {
    console.error(
      `Error fetching reports for category ${categorySlug}:`,
      error,
    );
    return [];
  }
}

/**
 * Get a specific report by slug
 */
export async function getReport(slug: string): Promise<Report | null> {
  try {
    const report = await prisma.report.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            jobTitle: true,
          },
        },
        category: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return report;
  } catch (error) {
    console.error(`Error fetching report ${slug}:`, error);
    return null;
  }
}
