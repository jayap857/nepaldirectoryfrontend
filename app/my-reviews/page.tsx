"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import ReviewCard from "@/components/ReviewCard";
import reviewService from "@/services/reviewService";

interface Review {
  id: number;
  business: number;
  business_name: string;
  user: {
    id: number;
    username: string;
    review_count: number;
    profile_picture: string | null;
  };
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  sentiment_score: number | null;
  sentiment_label: string | null;
  is_edited: boolean;
  helpful_count: number;
  is_flagged: boolean;
  flagged_reason: string | null;
  time_ago: string;
}

export default function MyReviewsPage() {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      fetchMyReviews();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...reviews];

    // Filter by rating
    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter((review) => review.rating === rating);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }

    setFilteredReviews(filtered);
  }, [reviews, ratingFilter, sortBy]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      // Fetch reviews for current user
      const data = await reviewService.getReviews({ user: user?.id });
      setReviews(data.results || data || []);
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      showToast("error", error.message || "Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUpdated = () => {
    fetchMyReviews();
    showToast("success", "Review updated successfully!");
  };

  const handleReviewDeleted = () => {
    fetchMyReviews();
    showToast("success", "Review deleted successfully!");
  };

  // Calculate statistics
  const stats = {
    total: reviews.length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0",
    byRating: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:underline"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-1">
                Manage all your business reviews
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Statistics & Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              {/* Statistics */}
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-semibold text-gray-900">
                    {stats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-semibold text-yellow-600">
                    ⭐ {stats.averageRating}
                  </span>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  By Rating
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-8">
                        {rating}⭐
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: stats.total > 0
                              ? `${(stats.byRating[rating as keyof typeof stats.byRating] / stats.total) * 100}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {stats.byRating[rating as keyof typeof stats.byRating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Reviews List */}
          <div className="lg:col-span-3">
            {filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReviewUpdated={handleReviewUpdated}
                    onReviewDeleted={handleReviewDeleted}
                    showBusinessName={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {ratingFilter !== "all" || reviews.length === 0
                    ? "No Reviews Found"
                    : "No Reviews Yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {reviews.length === 0
                    ? "Start reviewing businesses to help others make informed decisions!"
                    : "No reviews match your current filters."}
                </p>
                {reviews.length === 0 && (
                  <Link
                    href="/businesses"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Businesses
                  </Link>
                )}
              </div>
            )}
          </@
        </div>
      </div>
    </div>
  );
}