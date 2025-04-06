import React from "react";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  // Add any other post properties that you need
};

type PostListProps = {
  posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-gray-500">No posts available in this category.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/posts/${post.slug}`} className="block">
            <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>
            )}

            {post.date && (
              <div className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
