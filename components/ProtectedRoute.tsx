// components/ProtectedRoute.tsx
'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireBusinessOwner?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireBusinessOwner = false,
  requireAdmin = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated but auth is required
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Business owner access required
      if (requireBusinessOwner && (!user || !user.is_business_owner)) {
        router.push('/dashboard');
        return;
      }

      // Admin access required
      if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAuthenticated, isAdmin, requireAuth, requireBusinessOwner, requireAdmin, redirectTo, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
  <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Not a business owner
  if (requireBusinessOwner && (!user || !user.is_business_owner)) {
    return null;
  }

  // Not an admin
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

// Export a custom hook for convenience
export const useProtectedRoute = (
  requireBusinessOwner = false,
  requireAdmin = false
) => {
  const { user, loading, isAuthenticated, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireBusinessOwner && !user?.is_business_owner) {
        router.push('/dashboard');
      } else if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, isAuthenticated, isAdmin, requireBusinessOwner, requireAdmin, router]);

  return { user, loading, isAuthenticated, isAdmin };
};