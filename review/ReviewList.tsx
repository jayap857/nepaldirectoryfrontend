import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Edit, Trash2, User, MoreVertical } from 'lucide-react';

interface Review {
  id: number;
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
  time_ago: string;
  is_edited: boolean;
  helpful_count: number;
  sentiment_label: string | null;
  is_flagged: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: number;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
  onFlag?: (reviewId: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
  onFlag,
  loading = false,
  emptyMessage = "No reviews yet. Be the first to review!"
}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get sentiment badge
  const getSentimentBadge = (label: string | null) => {
    if (!label) return null;

    const badges = {
      POS: { text: 'Positive', color: 'bg-green-100 text-green-800' },
      NEU: { text: 'Neutral', color: 'bg-gray-100 text-gray-800' },
      NEG: { text: 'Negative', color: 'bg-red-100 text-red-800' }
    };

    const badge = badges[label as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  // Toggle menu
  const toggleMenu = (reviewId: number) => {
    setActiveMenu(activeMenu === reviewId ? null : reviewId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm">
        <Star size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwnReview = currentUserId === review.user.id;

        return (
          <div
            key={review.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.user.profile_picture ? (
                    <img
                      src={review.user.profile_picture}
                      alt={review.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                  )}
                </div>

                {/* User Info & Rating */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900">
                      {review.user.username}
                    </h4>
                    <span className="text-sm text-gray-500">
                      • {review.user.review_count} reviews
                    </span>
                    {isOwnReview && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {review.time_ago}
                    </span>
                    {review.is_edited && (
                      <span className="text-xs text-gray-500 italic">
                        (edited)
                      </span>
                    )}
                    {getSentimentBadge(review.sentiment_label)}
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              {(isOwnReview || onFlag) && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(review.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>

                  {activeMenu === review.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      {isOwnReview && onEdit && (
                        <button
                          onClick={() => {
                            onEdit(review);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Edit size={16} />
                          Edit Review
                        </button>
                      )}
                      
                      {isOwnReview && onDelete && (
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this review?')) {
                              onDelete(review.id);
                            }
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 size={16} />
                          Delete Review
                        </button>
                      )}

                      {!isOwnReview && onFlag && (
                        <button
                          onClick={() => {
                            onFlag(review.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Flag size={16} />
                          Report Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Review Comment */}
            {review.comment && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            )}

            {/* Footer Actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <ThumbsUp size={16} />
                <span className="text-sm">Helpful ({review.helpful_count})</span>
              </button>
            </div>

            {/* Flagged Warning */}
            {review.is_flagged && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <Flag size={16} className="text-red-600" />
                <span className="text-sm text-red-700">
                  This review has been flagged for moderation
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;