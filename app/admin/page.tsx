"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import AdminLayout from "@/components/adminLayout";
import adminService from "@/services/adminService";

interface DashboardStats {
  total_businesses: number;
  total_users: number;
  total_reviews: number;
  total_categories: number;
  pending_businesses: number;
  flagged_reviews: number;
  new_users_this_month: number;
  new_businesses_this_month: number;
}

interface RecentActivity {
  id: number;
  type: "business" | "review" | "user";
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useContext(AuthContext) as AuthContextType;
  const router = useRouter();
  const { showToast } = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

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
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getRecentActivities(),
      ]);
      
      setStats(statsData);
      setRecentActivities(activitiesData);
    } catch (error: any) {
      console.error("Failed to fetch admin dashboard:", error);
      showToast("error", error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your platform</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Statistics Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Businesses */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_businesses}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    +{stats.new_businesses_this_month} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_users}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    +{stats.new_users_this_month} this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_reviews}
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    {stats.flagged_reviews} flagged
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>

            {/* Total Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.total_categories}
                  </p>
                  <p className="text-sm text-purple-600 mt-2">
                    {stats.pending_businesses} pending approval
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/categories"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <div className="text-3xl mb-2">📁</div>
              <h3 className="font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-600 mt-1">Add, edit, or remove</p>
            </Link>

            <Link
              href="/admin/businesses"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-center"
            >
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="font-semibold text-gray-900">Manage Businesses</h3>
              <p className="text-sm text-gray-600 mt-1">Approve & verify</p>
            </Link>

            <Link
              href="/admin/reviews"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition text-center"
            >
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-900">Moderate Reviews</h3>
              <p className="text-sm text-gray-600 mt-1">Handle flagged content</p>
            </Link>

            <Link
              href="/admin/users"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-center"
            >
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View & moderate</p>
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <Link
              href="/admin/activities"
              className="text-blue-600 hover:underline text-sm"
            >
              View All →
            </Link>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === "business" && <span className="text-xl">🏢</span>}
                    {activity.type === "review" && <span className="text-xl">⭐</span>}
                    {activity.type === "user" && <span className="text-xl">👤</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activities</p>
            </div>
          )}
        </div>

        {/* Pending Approvals Alert */}
        {stats && stats.pending_businesses > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Pending Approvals
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You have {stats.pending_businesses} business{stats.pending_businesses > 1 ? "es" : ""} waiting for approval.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/admin/businesses?filter=pending"
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Review pending businesses →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flagged Reviews Alert */}
        {stats && stats.flagged_reviews > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚩</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Flagged Reviews
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {stats.flagged_reviews} review{stats.flagged_reviews > 1 ? "s have" : " has"} been flagged for moderation.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/admin/reviews?filter=flagged"
                    className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Review flagged content →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}