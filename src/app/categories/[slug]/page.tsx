import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import SubscriptionButton from "@/components/SubscriptionButton";
import type { Metadata } from "next";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found | SciencePostmortems",
    };
  }

  return {
    title: `${category.name} | SciencePostmortems`,
    description: `Browse reports about ${category.name} on SciencePostmortems`,
  };
}

async function getCategory(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getCategoryReports(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        reports: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                jobTitle: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        },
      },
    });

    return category?.reports || [];
  } catch (error) {
    console.error("Error fetching category reports:", error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  const reports = await getCategoryReports(params.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
        </div>

        <SubscriptionButton
          type="category"
          itemId={category.id}
          itemName={category.name}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Reports in this category
          </h2>
        </div>

        {reports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id}>
                <Link href={`/reports/${report.slug}`}>
                  <div className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">
                        {report.title}
                      </h3>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {report.author.jobTitle || "Anonymous"}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Posted on{" "}
                          <time dateTime={report.createdAt.toString()}>
                            {formatDate(report.createdAt)}
                          </time>
                        </p>
                        <div className="ml-6 flex items-center">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008c-.225.015-.454.008-.682-.018-1.944-.21-3.394-1.66-3.604-3.604-.034-.284-.036-.568-.008-.85A6.99 6.99 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-1">
                            {report._count.comments} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 mb-4">
              No reports found in this category.
            </p>
            <Link
              href="/reports/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create the first report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
