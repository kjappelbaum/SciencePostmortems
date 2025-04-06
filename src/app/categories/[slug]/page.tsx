import React from "react";
import { getCategory, getCategoryReports } from "@/lib/api";
import CategoryHeader from "@/components/CategoryHeader";
import PostList from "@/components/PostList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Updated Props type to match PageProps constraint
type Props = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  // Explicitly await the params
  const params = await Promise.resolve(props.params);
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

export default async function CategoryPage(props: Props) {
  // Explicitly await the params
  const params = await Promise.resolve(props.params);
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
