"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import authService from "@/services/authService";
import Link from "next/link";
import Image from "next/image";

// Types
interface DashboardData {
  user_profile: {
    id: number;
    username: string;
    email: string;
    phone_number: string | null;
    profile_picture_url: string | null;
    is_business_owner: boolean;
    is_customer: boolean;
    date_joined: string;
    review_count: number;
    business_count: number;
    average_rating_given: number | null;
  };
  businesses: Array<{
    id: number;
    name: string;
    category: string;
    city: string;
    address: string;
    image_url: string | null;
    average_rating: number | null;
    review_count: number;
    is_verified: boolean;
  }>;
  recent_reviews: Array<{
    id: number;
    business_name: string;
    rating: number;
    comment: string | null;
    time_ago: string;
    is_edited: boolean;
  }>;
  stats: {
    total_businesses: number;
    total_reviews: number;
    average_rating_given: number;
  };
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < Math.floor(rating)
              ? "text-yellow-500"
              : rating - i >= 0.5
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
        >
          {i < Math.floor(rating) || (rating - i >= 0.5 && rating % 1 !== 0) ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

// Avatar Component
const UserAvatar = ({ user }: { user: DashboardData["user_profile"] }) => {
  const initials = user.username.charAt(0).toUpperCase();

  return user.profile_picture_url ? (
    <Image
      src={user.profile_picture_url}
      alt={user.username}
      width={64}
      height={64}
      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
      unoptimized
    />
  ) : (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
      {initials}
    </div>
  );
};

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
  </div>
);

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");
      setDataLoading(true);
      const data = await authService.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      const msg = err.message || "Failed to load dashboard. Please try again.";
      setError(msg);
      showToast("error", msg);
      console.error("Dashboard fetch error:", err);
    } finally {
      setDataLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [loading, isAuthenticated, router, fetchDashboardData]);

  // Loading State
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <SkeletonCard />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonCard />
          <SkeletonCard />
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">Warning</div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const hasBusinesses = dashboardData.businesses.length > 0;
  const hasReviews = dashboardData.recent_reviews.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
              >
                Home
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <UserAvatar user={dashboardData.user_profile} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {dashboardData.user_profile.username}!
              </h2>
              <p className="text-gray-600">{dashboardData.user_profile.email}</p>
              {dashboardData.user_profile.phone_number && (
                <p className="text-sm text-gray-500 mt-1">
                  {dashboardData.user_profile.phone_number}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "My Businesses",
              value: dashboardData.stats.total_businesses,
              color: "blue",
              icon: "Building",
            },
            {
              label: "My Reviews",
              value: dashboardData.stats.total_reviews,
              color: "green",
              icon: "Chat",
            },
            {
              label: "Avg Rating Given",
              value:
                dashboardData.stats.average_rating_given?.toFixed(1) || "N/A",
              color: "yellow",
              icon: "Star",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p
                    className={`text-3xl font-bold mt-2 text-${stat.color}-600`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={`text-${stat.color}-500 text-3xl`}>
                  {stat.icon === "Building" && "Building"}
                  {stat.icon === "Chat" && "Chat"}
                  {stat.icon === "Star" && "Star"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Businesses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              My Businesses
            </h3>
            <div className="flex gap-3">
              {hasBusinesses && (
                <Link
                  href="/my-businesses"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all →
                </Link>
              )}
              <Link
                href="/business/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                + Add Business
              </Link>
            </div>
          </div>

          {hasBusinesses ? (
            <div className="space-y-4">
              {dashboardData.businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-4">
                    {business.image_url ? (
                      <Image
                        src={business.image_url}
                        alt={business.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {business.name}
                        {business.is_verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {business.category} • {business.city}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        {business.average_rating ? (
                          <StarRating rating={business.average_rating} />
                        ) : (
                          <span className="text-gray-400">No ratings</span>
                        )}
                        <span className="text-gray-500">
                          {business.review_count} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/business/${business.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't added any businesses yet.
            </p>
          )}
        </div>

        {/* Recent Reviews */}
        {hasReviews && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Recent Reviews
              </h3>
              <Link
                href="/my-reviews"
                className="text-sm text-blue-600 hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardData.recent_reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.business_name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-gray-500">
                          {review.time_ago}
                          {review.is_edited && " • edited"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasBusinesses && !hasReviews && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">Rocket</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Your Dashboard
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't added any businesses or written reviews yet. Get started by adding your business or exploring the directory.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/business/create"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Your Business
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}