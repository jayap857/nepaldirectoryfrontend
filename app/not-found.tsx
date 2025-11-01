"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, Search, Plus, ChevronLeft } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function NotFound() {
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Show fun toast
    showToast("info", "Lost? We'll take you home in 10s...");

    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Log 404
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      console.warn("404 Page Not Found:", window.location.href);
    }

    return () => clearInterval(timer);
  }, [showToast]);

  return (
    <>
      {/* SEO */}
      <title>404 - Page Not Found | Nepal Directory</title>
      <meta name="robots" content="noindex" />
      <meta name="description" content="The page you're looking for doesn't exist." />

      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-md w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4 animate-bounce">404</div>
            <div className="text-6xl mb-4 animate-pulse">
              <Search className="w-16 h-16 mx-auto" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 max-w-xs mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Countdown */}
          <p className="text-sm text-gray-500 mb-6">
            Redirecting home in{" "}
            <span className="font-bold text-blue-600">{countdown}s</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/businesses"
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Businesses
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">You might be looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/profile" className="text-blue-600 hover:underline">
                Profile
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/business/create"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Add Business
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}