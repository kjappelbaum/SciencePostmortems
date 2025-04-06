import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ReportForm from "@/components/ReportForm";

const prisma = new PrismaClient();

export const metadata = {
  title: "Create New Report | SciencePostmortems",
  description: "Share your scientific mistake and help others learn from it",
};

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

export default async function NewReportPage() {
  const user = await getCurrentUser();

  // Redirect unauthenticated users to login
  if (!user) {
    redirect("/login?redirect=/reports/new");
  }

  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Share Your Experience
        </h1>

        <p className="text-gray-600 mb-8">
          Share a scientific mistake or challenge you&apos;ve faced. Your
          anonymous report will help others learn and contribute to a better
          error culture in science.
        </p>

        <ReportForm categories={categories} />
      </div>
    </div>
  );
}
