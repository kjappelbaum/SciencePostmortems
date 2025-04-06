"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Editor from "./Editor";
import { toast } from "react-hot-toast";

type CommentAuthor = {
  id: string;
  jobTitle: string | null;
  reputation: number;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  parentId: string | null;
};

interface CommentSectionProps {
  reportId: string;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  reportId,
  comments,
}) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Filter top-level comments
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null,
  );

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((comment) => comment.parentId === commentId);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          reportId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add comment");
      }

      setNewComment("");
      toast.success("Comment added successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to reply");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
          reportId,
          parentId: commentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add reply");
      }

      setReplyingTo(null);
      setReplyContent("");
      toast.success("Reply added successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete comment");
      }

      toast.success("Comment deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isAuthor = user?.id === comment.author.id;
    const replies = getReplies(comment.id);

    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-8" : "border-t border-gray-200"} py-4`}
      >
        <div className="flex justify-between items-start">
          <div className="text-sm">
            <p className="font-medium text-gray-800">
              {comment.author.jobTitle || "Anonymous"}
              {comment.author.reputation > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ✦ {comment.author.reputation} reputation
                </span>
              )}
            </p>
            <p className="text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>

          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-800"
                title="Delete"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div
          className="mt-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />

        <div className="mt-2">
          {replyingTo === comment.id ? (
            <div className="mt-3">
              <Editor
                initialContent=""
                onChange={setReplyContent}
                placeholder="Write a reply..."
                minHeight="100px"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={isSubmitting}
                  className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Reply"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Reply
            </button>
          )}
        </div>

        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>

      <div className="mb-6">
        <form onSubmit={handleCommentSubmit}>
          <Editor
            initialContent=""
            onChange={setNewComment}
            placeholder="Share your thoughts or ask questions..."
            minHeight="150px"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {!isAuthenticated
                ? "Log in to comment"
                : isSubmitting
                  ? "Submitting..."
                  : "Add Comment"}
            </button>
          </div>
        </form>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {topLevelComments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
