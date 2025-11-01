"use client";

import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import businessService from "@/services/businessService";
import reviewService from "@/services/reviewService";
import ReviewCard from "@/components/ReviewCard";
import Modal from "@/components/Modal";

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  contact_number: string;
  email: string;
  website: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  opening_hours: Record<string, string> | null;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  owner: {
    id: number;
    username: string;
    email: string;
  };
}

interface Review {
  id: number;
  user: {
    id: number;
    username: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showToast } = useToast();

  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Contact form
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submittingContact, setSubmittingContact] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReviewRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (reviewsLoading || !hasMoreReviews) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setReviewPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [reviewsLoading, hasMoreReviews]
  );

  // Pre-fill contact form
  useEffect(() => {
    if (user) {
      setContactName(user.username);
      setContactEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    fetchBusinessDetails();
    fetchReviews(1, false);
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      const data = await businessService.getBusinessById(Number(businessId));
      setBusiness(data);
    } catch (error: any) {
      setError(error.message || "Failed to load business");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (page: number, append = false) => {
    if (page === 1) setReviewsLoading(true);
    try {
      const data = await reviewService.getReviews({ business: businessId, page });
      setReviews((prev) => (append ? [...prev, ...data.results] : data.results));
      setHasMoreReviews(!!data.next);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (reviewPage > 1) {
      fetchReviews(reviewPage, true);
    }
  }, [reviewPage]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("error", "Please login to write a review");
      router.push("/login");
      return;
    }
    if (!reviewComment.trim()) {
      showToast("error", "Please write a comment");
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        business: Number(businessId),
        rating: reviewRating,
        comment: reviewComment,
      });
      showToast("success", "Review submitted!");
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
      fetchReviews(1, false);
      fetchBusinessDetails();
    } catch (error: any) {
      showToast("error", error.message || "Failed to submit");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      await businessService.contactBusiness(Number(businessId), {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      });
      showToast("success", "Message sent!");
      setShowContactModal(false);
    } catch (error: any) {
      showToast("error", error.message || "Failed to send");
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">Warning</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "This business does not exist"}</p>
          <Link
            href="/businesses"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
          >
            Back to Businesses
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && business.owner && business.owner.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Nepal Directory
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/businesses" className="text-gray-600 hover:text-gray-900">Browse</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          {" / "}
          <Link href="/businesses" className="hover:text-gray-900">Businesses</Link>
          {" / "}
          <span className="text-gray-900">{business.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-64 md:h-96 bg-gray-200 relative">
                {business.image_url ? (
                  <Image
                    src={business.image_url}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-2">Building</div>
                      <p>No Image</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {business.name}
                      {business.is_verified && <span className="text-blue-600 text-xl ml-2">Verified</span>}
                    </h1>
                    <p className="text-lg text-gray-600">{business.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl text-yellow-500">Star</span>
                      <span className="text-2xl font-bold">{business.average_rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{business.review_count} reviews</p>
                  </div>
                </div>

                {business.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
                    <p className="text-gray-700 leading-relaxed">{business.description}</p>
                  </div>
                )}

                {/* Opening Hours */}
                {business.opening_hours && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Opening Hours</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(business.opening_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map */}
                {business.latitude && business.longitude && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Location</h2>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuBQquA&q=${business.latitude},${business.longitude}`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400">Location</span>
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{business.address}, {business.city}</p>
                      </div>
                    </div>
                    {business.contact_number && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400">Phone</span>
                        <div>
                          <p className="font-medium text-gray-900">Phone</p>
                          <p className="text-gray-600">{business.contact_number}</p>
                        </div>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400">Email</span>
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="text-gray-600">{business.email}</p>
                        </div>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-400">Website</span>
                        <div>
                          <p className="font-medium text-gray-900">Website</p>
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {business.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {(business.facebook_url || business.instagram_url || business.twitter_url) && (
                    <div className="mt-6">
                      <p className="font-medium text-gray-900 mb-3">Follow Us</p>
                      <div className="flex gap-3">
                        {business.facebook_url && (
                          <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            Facebook
                          </a>
                        )}
                        {business.instagram_url && (
                          <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                            Instagram
                          </a>
                        )}
                        {business.twitter_url && (
                          <a href={business.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                            Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews ({business.review_count})</h2>
                {isAuthenticated && !isOwner && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-4">Write Your Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition hover:scale-110"
                        >
                          <svg
                            className={`w-8 h-8 ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience..."
                    />
                    <p className="text-sm text-gray-500 mt-1">{reviewComment.length}/500</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit"}
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviewsLoading && reviews.length === 0 ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">Speech Bubble</div>
                  <p className="text-gray-600">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={review.id}
                      ref={index === reviews.length - 1 ? lastReviewRef : null}
                    >
                      <ReviewCard
                        review={review}
                        currentUserId={user?.id}
                        onUpdate={() => {
                          fetchReviews(1, false);
                          fetchBusinessDetails();
                        }}
                      />
                    </div>
                  ))}
                  {reviewsLoading && reviews.length > 0 && (
                    <div className="text-center py-4">
                      <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isOwner && (
                  <Link
                    href={`/business/${business.id}/edit`}
                    className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-center block"
                  >
                    Edit Business
                  </Link>
                )}
                {!isOwner && (
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Contact Business
                  </button>
                )}
                {business.contact_number && (
                  <a
                    href={`tel:${business.contact_number}`}
                    className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                  >
                    Call Now
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Business Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{business.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City</span>
                  <span className="font-medium text-gray-900">{business.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${business.is_active ? "text-green-600" : "text-red-600"}`}>
                    {business.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified</span>
                  <span className="font-medium text-gray-900">{business.is_verified ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Business" size="md">
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message..."
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={submittingContact}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingContact ? "Sending..." : "Send"}
            </button>
            <button type="button" onClick={() => setShowContactModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}