type ReportPageProps = {
  params: {
    slug: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const { slug } = params;

  // Rest of your component logic

  return (
    // Your component JSX
  );
}
```

The issue was that you might have been defining the component with incorrect prop types or using an incorrect interface from Next.js. The `PageProps` type that Next.js is checking against expects `params` to be a Promise, but you're providing a simple object.

With the fix above, we explicitly define the props type for your dynamic route page component with the correct structure that Next.js app router expects.

If you continue to have issues, please share the content of your `page.tsx` file so I can provide a more specific fix.

```tsx science-postmortems/src/app/reports/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import SubscriptionButton from "@/components/SubscriptionButton";
import CommentSection from "@/components/CommentSection";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const report = await getReport(params.slug);

  if (!report) {
    return {
      title: "Report Not Found | SciencePostmortems",
    };
  }

  return {
    title: `${report.title} | SciencePostmortems`,
    description: `Learn from this scientific experience: ${report.title}`,
  };
}

async function getReport(slug: string) {
  try {
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

    return report;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}

export default async function ReportDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getCurrentUser();
  const report = await getReport(params.slug);

  if (!report) {
    notFound();
  }

  const isAuthor = user?.id === report.author.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Report header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/categories/${report.category.slug}`}
                className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2"
              >
                {report.category.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {report.title}
              </h1>
            </div>

            <div className="flex space-x-3">
              {isAuthor && (
                <Link
                  href={`/reports/${report.slug}/edit`}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </Link>
              )}

              <SubscriptionButton
                type="report"
                itemId={report.id}
                itemName={report.title}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">
                {report.author.jobTitle || "Anonymous"}
              </span>
              {report.author.fieldOfStudy && (
                <span className="ml-2">in {report.author.fieldOfStudy}</span>
              )}
              {report.author.reputation > 0 && (
                <span className="ml-2">
                  ✦ {report.author.reputation} reputation
                </span>
              )}
            </div>
            <span className="mx-2">•</span>
            <time dateTime={report.createdAt.toString()}>
              {formatDate(report.createdAt)}
            </time>
          </div>
        </div>

        {/* Report content */}
        <div className="px-6 py-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description (What happened?)
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: report.description }}
              />
            </section>

            {report.reason && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reason (Why did it happen?)
                </h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: report.reason }}
                />
              </section>
            )}

            {report.learning && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Learning (What can we learn from this?)
                </h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: report.learning }}
                />
              </section>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className="px-6 py-8 border-t border-gray-200">
          <CommentSection reportId={report.id} comments={report.comments} />
        </div>
      </div>
    </div>
  );
}
```



The error is occurring because you're using an async function for your page component, but the type definition for the props isn't correctly typed to handle this.

Here's how to fix your code:

```tsx
// src/app/reports/[slug]/page.tsx

// Import statements remain the same

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every 60 seconds

// Type definition for the params
type PageParams = {
  params: {
    slug: string;
  };
};

// Generate metadata for the page - this looks good already
export async function generateMetadata({ params }: PageParams) {
  // ...existing code
}

async function getReport(slug: string) {
  // ...existing code
}

// Fix: Make sure the page component has the correct props type
export default async function ReportDetailPage({ params }: PageParams) {
  // ...rest of your existing component code
}
```

The key change is defining a proper type (`PageParams`) for the parameters passed to your page component and using it consistently in both the `generateMetadata` function and the page component.

In Next.js App Router, when you use async server components, you need to ensure the props type definitions match what Next.js expects. By defining a consistent `PageParams` type and using it for both functions, you'll resolve the type error.

This change should resolve the type error without requiring any changes to your component's actual functionality.

could you provide me with the full code of the file?

Here's the full code of the file with the fix applied:

```tsx
// src/app/reports/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import SubscriptionButton from "@/components/SubscriptionButton";
import CommentSection from "@/components/CommentSection";

const prisma = new PrismaClient();

export const revalidate = 60; // Revalidate every 60 seconds

// Type definition for the params
type PageParams = {
  params: {
    slug: string;
  };
};

// Generate metadata for the page
export async function generateMetadata({ params }: PageParams) {
  const report = await getReport(params.slug);

  if (!report) {
    return {
      title: "Report Not Found | SciencePostmortems",
    };
  }

  return {
    title: `${report.title} | SciencePostmortems`,
    description: `Learn from this scientific experience: ${report.title}`,
  };
}

async function getReport(slug: string) {
  try {
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

    return report;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}

export default async function ReportDetailPage({ params }: PageParams) {
  const user = await getCurrentUser();
  const report = await getReport(params.slug);

  if (!report) {
    notFound();
  }

  const isAuthor = user?.id === report.author.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Report header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/categories/${report.category.slug}`}
                className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2"
              >
                {report.category.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {report.title}
              </h1>
            </div>

            <div className="flex space-x-3">
              {isAuthor && (
                <Link
                  href={`/reports/${report.slug}/edit`}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </Link>
              )}

              <SubscriptionButton
                type="report"
                itemId={report.id}
                itemName={report.title}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">
                {report.author.jobTitle || "Anonymous"}
              </span>
              {report.author.fieldOfStudy && (
                <span className="ml-2">in {report.author.fieldOfStudy}</span>
              )}
              {report.author.reputation > 0 && (
                <span className="ml-2">
                  ✦ {report.author.reputation} reputation
                </span>
              )}
            </div>
            <span className="mx-2">•</span>
            <time dateTime={report.createdAt.toString()}>
              {formatDate(report.createdAt)}
            </time>
          </div>
        </div>

        {/* Report content */}
        <div className="px-6 py-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description (What happened?)
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: report.description }}
              />
            </section>

            {report.reason && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reason (Why did it happen?)
                </h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: report.reason }}
                />
              </section>
            )}

            {report.learning && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Learning (What can we learn from this?)
                </h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: report.learning }}
                />
              </section>
            )}
          </div>
        </div>

        {/* Comments section */}
        <div className="px-6 py-8 border-t border-gray-200">
          <CommentSection reportId={report.id} comments={report.comments} />
        </div>
      </div>
    </div>
  );
}
