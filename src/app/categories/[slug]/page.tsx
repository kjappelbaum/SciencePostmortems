import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getCategoryReports } from "@/lib/api";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Reports | Science Postmortems`,
    description: `Browse all postmortem reports related to ${category.name} in scientific research.`,
  };
}

export default async function CategoryPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const reports = await getCategoryReports(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name} Reports</h1>

      {category.description && (
        <div className="mb-8 text-gray-700">
          <p>{category.description}</p>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No reports found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
                <p className="text-gray-600 text-sm mb-3">
                  {new Date(report.date).toLocaleDateString()}
                </p>
                {report.excerpt && (
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {report.excerpt}
                  </p>
                )}
                <a
                  href={`/reports/${report.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read full report →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
