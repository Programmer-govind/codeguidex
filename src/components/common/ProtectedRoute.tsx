'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'mentor' | 'admin';
}

/**
 * ProtectedRoute component - restricts access to authenticated users only
 * Redirects unauthenticated users to login page
 *
 * @param children - Component to render if authenticated
 * @param requiredRole - Optional role-based access control
 * @returns Protected component or redirect to login
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoading) {
      return; // Still loading auth state
    }

    if (!isAuthenticated) {
      // Check if we're on an admin route and redirect to admin login
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        router.push('/admin/login');
      } else {
        router.push('/auth/login');
      }
      return;
    }

    // Check role-based access control if specified
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, isLoading, requiredRole, user?.role, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authenticated and authorized
  if (isAuthenticated && (!requiredRole || user?.role === requiredRole)) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
