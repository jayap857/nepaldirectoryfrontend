"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  business_count: number;
}

interface Statistics {
  total_businesses: number;
  total_reviews: number;
  average_rating: number;
}

export default function HomePage() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const router = useRouter();

  const [topBusinesses, setTopBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [topRated, cats, stats] = await Promise.all([
        businessService.getTopRatedBusinesses("all", 6),
        businessService.getPublicCategories(),
        businessService.getStatistics(),
      ]);

      setTopBusinesses(topRated);
      setCategories(cats);
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/businesses?search=${encodeURIComponent(searchQuery)}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-blue-600">
                🇳🇵 Nepal Directory
              </h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/businesses"
                className="text-gray-600 hover:text-gray-900"
              >
                Browse
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Local Businesses in Nepal
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Find the best restaurants, services, and shops near you
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for businesses, services, restaurants..."
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Statistics Section */}
      {statistics && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-600">
                  {statistics.total_businesses}+
                </p>
                <p className="text-gray-600 mt-2">Businesses Listed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600">
                  {statistics.total_reviews}+
                </p>
                <p className="text-gray-600 mt-2">Customer Reviews</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-yellow-600">
                  {statistics.average_rating.toFixed(1)}⭐
                </p>
                <p className="text-gray-600 mt-2">Average Rating</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/businesses?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-3">
                  {category.icon || "📂"}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {category.business_count} businesses
                </p>
              </Link>
            ))}
          </div>
          {categories.length > 8 && (
            <div className="text-center mt-8">
              <Link
                href="/businesses"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Top Rated Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              Top Rated Businesses
            </h3>
            <Link
              href="/businesses?sort=rating"
              className="text-blue-600 hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBusinesses.map((business) => (
              <Link
                key={business.id}
                href={`/business/${business.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-200">
                  {business.image_url ? (
                    <img
                      src={business.image_url}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {business.name}
                    </h4>
                    {business.is_verified && (
                      <span className="text-blue-600 text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {business.category} • {business.city}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">
                      ⭐ {business.average_rating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({business.review_count} reviews)
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Own a Business in Nepal?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already listed on our platform
          </p>
          {isAuthenticated ? (
            <Link
              href="/business/create"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Add Your Business
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Nepal Directory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}