import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import SubscriptionButton from "@/components/SubscriptionButton";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate this page every 60 seconds

async function getHomePageData() {
  try {
    // Get latest reports
    const reports = await prisma.report.findMany({
      take: 10,
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

    // Get categories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { reports, categories };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return { reports: [], categories: [] };
  }
}

export default async function HomePage() {
  const { reports, categories } = await getHomePageData();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Science Postmortems</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A platform for sharing, discussing, and learning from mistakes in
          science. Help foster a better error culture where mistakes are seen as
          opportunities to learn.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/reports/new"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Share Your Experience
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="#reports"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Browse Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <nav className="space-y-2" aria-label="Categories">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <span>{category.name}</span>
                      <SubscriptionButton
                        type="category"
                        itemId={category.id}
                        itemName={category.name}
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Report list */}
        <div id="reports" className="lg:col-span-9">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Latest Reports
              </h2>
              <Link
                href="/reports"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all →
              </Link>
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
                <p className="text-gray-500">
                  No reports found. Be the first to share!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
