import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Convert a string to a URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// Generate a unique slug for a report
export async function generateSlug(title: string): Promise<string> {
  let slug = slugify(title);
  let isUnique = false;
  let attempt = 1;

  // Check if the slug is unique
  while (!isUnique) {
    const existingReport = await prisma.report.findUnique({
      where: { slug },
    });

    if (!existingReport) {
      isUnique = true;
    } else {
      // If not unique, append a number and try again
      slug = `${slugify(title)}-${attempt}`;
      attempt++;
    }
  }

  return slug;
}

// Format a date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// Format a date with time for display
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Truncate text to a specific length
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + "...";
}

// Clean HTML content (basic)
export function sanitizeHtml(html: string): string {
  // This is a very basic implementation
  // For production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "");
}
