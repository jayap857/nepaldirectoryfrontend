'use client';

import React, { useState, useEffect } from 'react';
import { Search, Flag, CheckCircle, XCircle, User, Building, AlertTriangle, Star } from 'lucide-react';

interface FlaggedReview {
  id: number;
  business: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
  rating: number;
  comment: string;
  flagged_reason: string;
  created_at: string;
  sentiment_label: 'POS' | 'NEG' | 'NEU' | null;
}

export default function ReviewModerationPage() {
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFlaggedReviews();
  }, []);

  const loadFlaggedReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews/?is_flagged=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch flagged reviews');
      
      const data = await response.json();
      setFlaggedReviews(data.results || data);
    } catch (error) {
      console.error('Error loading flagged reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ is_flagged: false, flagged_reason: '' }),
      });

      if (!response.ok) throw new Error('Failed to approve review');

      setFlaggedReviews(flaggedReviews.filter(r => r.id !== reviewId));
      alert('Review approved successfully!');
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete review');

      setFlaggedReviews(flaggedReviews.filter(r => r.id !== reviewId));
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const getSentimentColor = (label: string | null) => {
    switch(label) {
      case 'POS': return 'text-green-600 bg-green-50';
      case 'NEG': return 'text-red-600 bg-red-50';
      case 'NEU': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentLabel = (label: string | null) => {
    switch(label) {
      case 'POS': return 'Positive';
      case 'NEG': return 'Negative';
      case 'NEU': return 'Neutral';
      default: return 'Unknown';
    }
  };

  const filteredReviews = flaggedReviews.filter(review =>
    review.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
              <p className="text-gray-600 mt-2">Manage flagged reviews and moderate content</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-900">{flaggedReviews.length}</span>
              <span className="text-red-700">Pending Reviews</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by business, user, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No flagged reviews to moderate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment_label)}`}>
                          {getSentimentLabel(review.sentiment_label)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{review.business.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        by <span className="font-medium">{review.user.username}</span> • {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Flagged Reason */}
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <Flag className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-1">Flagged Reason:</p>
                      <p className="text-sm text-red-700">{review.flagged_reason}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete
                    </button>
                    <button 
                      onClick={() => window.location.href = `/profile/${review.user.id}`}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View User
                    </button>
                    <button 
                      onClick={() => window.location.href = `/business/${review.business.id}`}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                    >
                      <Building className="w-4 h-4" />
                      View Business
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}