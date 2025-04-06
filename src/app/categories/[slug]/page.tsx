import React from "react";
import { getCategory } from "@/lib/api";
import CategoryHeader from "@/components/CategoryHeader";
import PostList from "@/components/PostList";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  // Await the params if it's a promise
  const params = "then" in props.params ? await props.params : props.params;
  const slug = params.slug;

  const category = await getCategory(slug);

  return {
    title: `${category.name} | Science Postmortems`,
    description: category.description,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  // Await the params if it's a promise
  const params = "then" in props.params ? await props.params : props.params;
  const slug = params.slug;

  const category = await getCategory(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader
        name={category.name}
        description={category.description}
        imageUrl={category.imageUrl}
      />

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Posts in {category.name}</h2>
        <PostList posts={category.posts} />
      </div>
    </div>
  );
}
