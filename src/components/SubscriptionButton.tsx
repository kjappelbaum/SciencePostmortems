"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

interface SubscriptionButtonProps {
  type: "report" | "category";
  itemId: string;
  itemName: string; // Kept for future use if needed
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  type,
  itemId,
  // itemName is unused but kept for future expansions
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check subscription status when component mounts and auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscriptionStatus();
    } else {
      setIsSubscribed(false);
      setSubscriptionId(null);
      setInitialCheckDone(true);
    }
    // Adding checkSubscriptionStatus to dependencies
  }, [isAuthenticated, itemId, type, checkSubscriptionStatus]);

  // Fetch current subscription status
  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const subscriptions = await response.json();

      // Find if user is subscribed to this item
      const subscription = subscriptions.find(
        (sub: { reportId?: string; categoryId?: string }) =>
          (type === "report" && sub.reportId === itemId) ||
          (type === "category" && sub.categoryId === itemId),
      );

      if (subscription) {
        setIsSubscribed(true);
        setSubscriptionId(subscription.id);
      } else {
        setIsSubscribed(false);
        setSubscriptionId(null);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    } finally {
      setIsLoading(false);
      setInitialCheckDone(true);
    }
  };

  const toggleSubscription = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast.error("Please log in to subscribe");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed && subscriptionId) {
        // Unsubscribe
        const response = await fetch(
          `/api/subscriptions?id=${subscriptionId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to unsubscribe");
        }

        setIsSubscribed(false);
        setSubscriptionId(null);
        toast.success(
          `Unsubscribed from ${type === "report" ? "report" : "category"}`,
        );
      } else {
        // Subscribe
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [type === "report" ? "reportId" : "categoryId"]: itemId,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to subscribe");
        }

        const data = await response.json();
        setIsSubscribed(true);
        setSubscriptionId(data.subscription.id);
        toast.success(
          `Subscribed to ${type === "report" ? "report" : "category"}`,
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialCheckDone) {
    return (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm opacity-50"
      >
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={toggleSubscription}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
        isSubscribed
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
          : "bg-[#A43830] hover:bg-[#8A2E27] text-white border-transparent"
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A43830] disabled:opacity-50`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
        </>
      ) : (
        <>
          {isSubscribed ? (
            <>
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
                <path
                  fill="currentColor"
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
              Unsubscribe
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Subscribe
            </>
          )}
        </>
      )}
    </button>
  );
};

// Fix the useEffect dependency by using useCallback
SubscriptionButton.displayName = "SubscriptionButton";

export default SubscriptionButton;
