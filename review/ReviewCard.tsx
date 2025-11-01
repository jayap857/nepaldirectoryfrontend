"use client";

import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import reviewService from "../services/reviewService";
import Modal from "./Modal";

interface ReviewUser {
  id: number;
  username: string;
  review_count: number;
  profile_picture: string | null;
}

interface Review {
  id: number;
  business: number;
  business_name: string;
  user: ReviewUser;
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

interface ReviewCardProps {
  review: Review;
  onReviewUpdated?: () => void;
  onReviewDeleted?: () => void;
  showBusinessName?: boolean;
}

export default function ReviewCard({
  review,
  onReviewUpdated,
  onReviewDeleted,
  showBusinessName = false,
}: ReviewCardProps) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showToast } = useToast();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [flagReason, setFlagReason] = useState("");

  const [loading, setLoading] = useState(false);

  // Check if current user is the review owner
  const isOwner = user?.id === review.user.id;

  // Handle Edit Review
  const handleEdit = async () => {
    if (editComment.trim().length < 10) {
      showToast("error", "Comment must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);
      await reviewService.updateReview(review.id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      showToast("success", "Review updated successfully!");
      setShowEditModal(false);
      if (onReviewUpdated) onReviewUpdated();
    } catch (error: any) {
      showToast("error", error.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Review
  const handleDelete = async () => {
    try {
      setLoading(true);
      await reviewService.deleteReview(review.id);
      showToast("success", "Review deleted successfully!");
      setShowDeleteModal(false);
      if (onReviewDeleted) onReviewDeleted();
    } catch (error: any) {
      showToast("error", error.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  // Handle Flag Review
  const handleFlag = async () => {
    if (!flagReason.trim()) {
      showToast("error", "Please provide a reason for flagging");
      return;
    }

    try {
      setLoading(true);
      await reviewService.flagReview(review.id, flagReason.trim());
      showToast("success", "Review flagged for moderation");
      setShowFlagModal(false);
      setFlagReason("");
    } catch (error: any) {
      showToast("error", error.message || "Failed to flag review");
    } finally {
      setLoading(false);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  // Render editable star rating
  const renderEditableStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setEditRating(star)}
            className={`text-2xl ${
              star <= editRating ? "text-yellow-500" : "text-gray-300"
            } hover:scale-110 transition`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  // Get sentiment badge
  const getSentimentBadge = () => {
    if (!review.sentiment_label) return null;

    const badges = {
      POS: { text: "Positive", color: "bg-green-100 text-green-800" },
      NEU: { text: "Neutral", color: "bg-gray-100 text-gray-800" },
      NEG: { text: "Negative", color: "bg-red-100 text-red-800" },
    };

    const badge = badges[review.sentiment_label as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {review.user.profile_picture ? (
                <img
                  src={review.user.profile_picture}
                  alt={review.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-semibold">
                  {review.user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900">
                  {review.user.username}
                </h4>
                {review.is_edited && (
                  <span className="text-xs text-gray-500">(edited)</span>
                )}
                {getSentimentBadge()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span>{review.user.review_count} reviews</span>
                <span>•</span>
                <span>{review.time_ago}</span>
              </div>
              {showBusinessName && (
                <p className="text-sm text-blue-600 mt-1">
                  Review for: {review.business_name}
                </p>
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <span className="text-gray-600">⋮</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {isOwner ? (
                    <>
                      <button
                        onClick={() => {
                          setShowEditModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
                      >
                        ✏️ Edit Review
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm text-red-600"
                      >
                        🗑️ Delete Review
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowFlagModal(true);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
                    >
                      🚩 Flag Review
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mb-3">{renderStars(review.rating)}</div>

        {/* Comment */}
        {review.comment && (
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        )}

        {/* Helpful Count (if > 0) */}
        {review.helpful_count > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              👍 {review.helpful_count} people found this helpful
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => !loading && setShowEditModal(false)}
        title="Edit Your Review"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            {renderEditableStars()}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              maxLength={500}
              placeholder="Share your experience..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {editComment.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowEditModal(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={loading || editComment.trim().length < 10}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !loading && setShowDeleteModal(false)}
        title="Delete Review"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Flag Modal */}
      <Modal
        isOpen={showFlagModal}
        onClose={() => !loading && setShowFlagModal(false)}
        title="Flag Review"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Please tell us why you're flagging this review:
          </p>

          <div>
            <select
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a reason</option>
              <option value="Spam or fake review">Spam or fake review</option>
              <option value="Offensive language">Offensive language</option>
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Conflict of interest">Conflict of interest</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowFlagModal(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFlag}
              disabled={loading || !flagReason}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Flagging..." : "Flag Review"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}