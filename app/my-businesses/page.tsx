"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import businessService from "@/services/businessService";

interface Business {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  image_url: string | null;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  created_at: string;
}

// Skeleton Card
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-48 h-48 bg-gray-200"></div>
      <div className="flex-1 p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function MyBusinessesPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadMyBusinesses();
  }, [user, router]);

  const loadMyBusinesses = async () => {
    try {
      setError("");
      setLoading(true);
      const myBusinesses = await businessService.getMyBusinesses();
      setBusinesses(myBusinesses);
    } catch (err: any) {
      const msg = err.message || "Failed to load your businesses";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      return;
    }

    try {
      await businessService.deleteBusiness(id);
      setBusinesses(businesses.filter((b) => b.id !== id));
      showToast("success", "Business deleted successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to delete business";
      showToast("error", msg);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Nepal Directory
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/businesses" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
              <p className="mt-2 text-gray-600">Manage all your business listings</p>
            </div>
            <Link
              href="/business/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add New Business
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Businesses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {businesses.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-3xl">Building</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {businesses.reduce((sum, b) => sum + b.review_count, 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-3xl">Star</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {businesses.length > 0
                    ? (
                        businesses.reduce((sum, b) => sum + b.average_rating, 0) /
                        businesses.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-3xl">Chart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Businesses List */}
        {businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">Building</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No businesses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first business to the directory
            </p>
            <Link
              href="/business/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Business
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Business Image */}
                  <div className="w-full md:w-48 h-48 bg-gray-200 flex-shrink-0 relative">
                    {business.image_url ? (
                      <Image
                        src={business.image_url}
                        alt={business.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Business Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {business.name}
                          </h3>
                          {business.is_verified && (
                            <span className="text-green-600 text-sm font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {business.category} • {business.city}
                        </p>
                        <p className="text-gray-500 text-sm">{business.address}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">Star</span>
                        <span className="text-gray-900 font-medium">
                          {business.average_rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {business.review_count} reviews
                      </div>
                      <div className="text-gray-500 text-sm">
                        Added {new Date(business.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/business/${business.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/business/${business.id}/edit`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
@