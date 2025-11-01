"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Loader2 } from "lucide-react";

interface Business {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  image_url: string | null;
  average_rating: number | null;
  review_count: number;
  is_verified: boolean;
}

interface Category {
  id: number;
  name: string;
  business_count: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";
const LIMIT = 12;

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default function BusinessesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBusinessRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setOffset((prev) => prev + LIMIT);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  // Sync URL with filters
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedCity) params.set("city", selectedCity);
    if (minRating) params.set("min_rating", minRating);
    router.replace(`/businesses?${params.toString()}`, { scroll: false });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCity("");
    setMinRating("");
    setOffset(0);
    setBusinesses([]);
    router.push("/businesses");
  };

  // Fetch businesses
  const fetchBusinesses = useCallback(
    async (isLoadMore = false) => {
      if (!isLoadMore) {
        setLoading(true);
        setBusinesses([]);
        setOffset(0);
        setError("");
      } else {
        setLoadingMore(true);
      }

      try {
        const params: Record<string, string> = {
          limit: LIMIT.toString(),
          offset: offset.toString(),
        };
        if (searchQuery) params.q = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedCity) params.city = selectedCity;
        if (minRating) params.min_rating = minRating;

        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/search/?${query}`);
        if (!res.ok) throw new Error("Failed to load businesses");

        const data: Business[] = await res.json();
        setBusinesses((prev) => (isLoadMore ? [...prev, ...data] : data));
        setHasMore(data.length === LIMIT);
      } catch (err: any) {
        setError(err.message || "Failed to load businesses");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, selectedCategory, selectedCity, minRating, offset]
  );

  // Fetch categories & cities
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch(`${API_BASE}/public-categories/`),
          fetch(`${API_BASE}/public-cities/`),
        ]);
        const cats = await catRes.json();
        const cities = await cityRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
        setCities(Array.isArray(cities) ? cities : []);
      } catch (err) {
        console.error("Failed to load filters");
      }
    };
    fetchFilters();
  }, []);

  // Initial load + URL sync
  useEffect(() => {
    const search = searchParams.get("search");
    const cat = searchParams.get("category");
    const city = searchParams.get("city");
    const rating = searchParams.get("min_rating");

    setSearchQuery(search || "");
    setSelectedCategory(cat || "");
    setSelectedCity(city || "");
    setMinRating(rating || "");
    setOffset(0);
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      fetchBusinesses(false);
      updateURL();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedCity, minRating]);

  // Load more
  useEffect(() => {
    if (offset > 0) {
      fetchBusinesses(true);
    }
  }, [offset, fetchBusinesses]);

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
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Businesses</h1>
          <p className="text-gray-600">{businesses.length} businesses found</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 mb-3">{error}</p>
            <button
              onClick={() => fetchBusinesses(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.business_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">Search</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business, index) => (
                      <div
                        key={business.id}
                        ref={index === businesses.length - 1 ? lastBusinessRef : null}
                      >
                        <Link href={`/business/${business.id}`} className="block">
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                            <div className="h-48 bg-gray-200 relative">
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
                              {business.is_verified && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  Verified
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                                {business.name}
                                {business.is_verified && <span className="text-green-600 text-sm">Check</span>}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {business.category} • {business.city}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-yellow-500 flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < Math.floor(business.average_rating || 0) ? "fill-current" : ""}`}
                                    />
                                  ))}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  ({business.review_count} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="space-y-4">
                    {businesses.map((business, index) => (
                      <div
                        key={business.id}
                        ref={index === businesses.length - 1 ? lastBusinessRef : null}
                      >
                        <Link href={`/business/${business.id}`} className="block">
                          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition flex">
                            <div className="w-48 h-48 bg-gray-200 relative flex-shrink-0">
                              {business.image_url ? (
                                <Image
                                  src={business.image_url}
                                  alt={business.name}
                                  fill
                                  className="object-cover rounded-l-lg"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                {business.name}
                                {business.is_verified && <span className="text-green-600 text-sm">Check</span>}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {business.category} • {business.city}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-yellow-500 flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < Math.floor(business.average_rating || 0) ? "fill-current" : ""}`}
                                    />
                                  ))}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  ({business.review_count} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More */}
                {loadingMore && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}