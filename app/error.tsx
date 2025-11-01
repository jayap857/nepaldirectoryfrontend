"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext"; // Best

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Report to error service
    console.error("Error boundary:", error);
    if (process.env.NODE_ENV === "production" && error.digest) {
      // TODO: Send to Sentry/LogRocket
      // captureException(error);
    }

    // Show toast
    showToast("error", "Something went wrong. Retrying soon...");

    // Auto-retry countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          reset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [error, reset, showToast]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center">
        {/* SEO */}
        <h1 className="sr-only">Application Error</h1>

        {/* Error Icon */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-pulse">Warning</div>
          <div className="text-2xl font-bold text-red-600 mb-2">
            Something went wrong!
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! An unexpected error occurred
          </h2>
          <p className="text-gray-600 mb-4">
            We apologize for the inconvenience. We're working to fix it.
          </p>

          {/* Dev-only Details */}
          {isDev && (
            <details className="bg-gray-50 rounded p-3 mb-4 text-left text-xs font-mono text-gray-700">
              <summary className="cursor-pointer font-semibold mb-1">
                Error Details (Dev)
              </summary>
              <p className="break-all">{error.message}</p>
              {error.digest && <p className="mt-1 opacity-75">Digest: {error.digest}</p>}
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            aria-label="Retry page load"
          >
            Retry Now
            {countdown > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-700 rounded text-sm">
                {countdown}s
              </span>
            )}
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Go Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-600 mb-8">
          <p className="mb-2">Try these steps:</p>
          <ul className="space-y-1 text-left max-w-xs mx-auto">
            <li>• Refresh the page</li>
            <li>• Clear browser cache</li>
            <li>• Check internet connection</li>
          </ul>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link href="/businesses" className="text-blue-600 hover:underline">
              Browse Businesses
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/profile" className="text-blue-600 hover:underline">
              Profile
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}