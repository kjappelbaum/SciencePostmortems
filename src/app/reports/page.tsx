import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { formatDate } from "@/lib/utils";

const prisma = new PrismaClient();

export const metadata = {
  title: "Browse Reports | SciencePostmortems",
  description: "Browse and search reports of scientific mistakes and learnings",
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getReports() {
  try {
    const reports = await prisma.report.findMany({
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
    console.error("Error fetching reports:", error);
    return [];
  }
}

async function getCategories() {
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

export default async function ReportsPage() {
  const reports = await getReports();
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Reports</h1>
        <Link
          href="/reports/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Share Your Experience
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Categories
              </h2>
              <nav className="space-y-1" aria-label="Categories">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Reports list */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {reports.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <li key={report.id}>
                    <Link href={`/reports/${report.slug}`}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-indigo-600 truncate">
                            {report.title}
                          </h3>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {report.category.name}
                            </span>
                          </div>
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
                <p className="text-gray-500 mb-4">No reports found.</p>
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
      </div>
    </div>
  );
}
