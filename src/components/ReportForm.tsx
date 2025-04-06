"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "./Editor";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

type Category = {
  id: string;
  name: string;
};

interface ReportFormProps {
  categories: Category[];
  initialValues?: {
    title?: string;
    categoryId?: string;
    description?: string;
    reason?: string;
    learning?: string;
  };
  isEditing?: boolean;
  reportSlug?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({
  categories,
  initialValues = {},
  isEditing = false,
  reportSlug,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState(initialValues.title || "");
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || "");
  const [description, setDescription] = useState(
    initialValues.description || "",
  );
  const [reason, setReason] = useState(initialValues.reason || "");
  const [learning, setLearning] = useState(initialValues.learning || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to create a report");
      router.push(`/login?redirect=${encodeURIComponent("/reports/new")}`);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide a description");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && reportSlug) {
        // Update existing report
        const response = await fetch(`/api/reports/${reportSlug}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            reason,
            learning,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to update report");
        }

        toast.success("Report updated successfully");
        router.push(`/reports/${reportSlug}`);
        router.refresh();
      } else {
        // Create new report
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            categoryId,
            description,
            reason,
            learning,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create report");
        }

        const data = await response.json();
        toast.success("Report created successfully");
        router.push(`/reports/${data.slug}`);
        router.refresh();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="A descriptive title for your report"
          disabled={isSubmitting}
          required
        />
      </div>

      {!isEditing && (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isSubmitting}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description (What happened?)
        </label>
        <Editor
          initialContent={description}
          onChange={setDescription}
          placeholder="Describe what happened in detail..."
          minHeight="200px"
        />
      </div>

      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700"
        >
          Reason (Why did it happen?)
        </label>
        <Editor
          initialContent={reason}
          onChange={setReason}
          placeholder="Explain the underlying causes..."
          minHeight="200px"
        />
      </div>

      <div>
        <label
          htmlFor="learning"
          className="block text-sm font-medium text-gray-700"
        >
          Learning (What can we learn from this?)
        </label>
        <Editor
          initialContent={learning}
          onChange={setLearning}
          placeholder="Share insights and takeaways..."
          minHeight="200px"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="mr-4 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Report"
              : "Create Report"}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
