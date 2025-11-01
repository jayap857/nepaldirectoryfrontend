"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import AdminLayout from "@/components/AdminLayout";
import adminService from "@/services/adminService";

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
  is_active: boolean;
  user: {
    id: number;
    username: string;
  };
  created_at: string;
}

export default function AdminBusinessesPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get("filter") || "all");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (!isAdmin) {
        showToast("error", "Access denied. Admin privileges required.");
        router.push("/");
        return;
      }
      fetchBusinesses();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBusinesses({ ordering: "-created_at" });
      setBusinesses(data);
    } catch (error: any) {
      console.error("Failed to fetch businesses:", error);
      showToast("error", error.message || "Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await adminService.verifyBusiness(id);
      showToast("success", "Business verified successfully!");
      fetchBusinesses();
    } catch (error: any) {
      showToast("error", error.message || "Failed to verify business");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    try {
      await adminService.deleteBusiness(id);
      showToast("success", "Business deleted successfully!");
      fetchBusinesses();
    } catch (error: any) {
      showToast("error", error.message || "Failed to delete business");
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !business.is_verified) ||
      (filterStatus === "verified" && business.is_verified) ||
      (filterStatus === "inactive" && !business.is_active);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: businesses.length,
    verified: businesses.filter((b) => b.is_verified).length,
    pending: businesses.filter((b) => !b.is_verified).length,
    inactive: businesses.filter((b) => !b.is_active).length,
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
          <p className="text-gray-600 mt-1">Manage and verify businesses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.verified}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Businesses</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <p className="text-gray-600 text-lg">No businesses found</p>
            </div>
          ) : (
            filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200 relative">
                  {business.image_url ? (
                    <Image
                      src={business.image_url}
                      alt={business.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🏢</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {business.is_verified && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                        ✅ Verified
                      </span>
                    )}
                    {!business.is_active && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                        ❌ Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{business.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    📍 {business.city} • 👤 {business.user.username}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium ml-1">
                        {business.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {business.review_count} reviews
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/business/${business.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                    >
                      👁️ View
                    </Link>
                    {!business.is_verified && (
                      <button
                        onClick={() => handleVerify(business.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        ✅ Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(business.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}