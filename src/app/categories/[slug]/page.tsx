import React from "react";
import { getCategory, getCategoryReports } from "@/lib/api";
import CategoryHeader from "@/components/CategoryHeader";
import PostList from "@/components/PostList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// For Next.js 13, we'll use the specific types that Next.js provides
type PageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.slug;

  if (!slug) {
    return {
      title: "Category Not Found | Science Postmortems",
      description: "The requested category could not be found.",
    };
  }

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found | Science Postmortems",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} | Science Postmortems`,
    description: category.description || "Posts in this category",
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const category = await getCategory(slug);
  if (!category) {
    notFound();
  }

  const posts = await getCategoryReports(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader
        name={category.name}
        description={category.description || ""}
        imageUrl={category.imageUrl || ""}
      />

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Posts in {category.name}</h2>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
