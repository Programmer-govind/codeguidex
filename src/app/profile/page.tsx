'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect to the user's own profile
        router.replace(`/profile/${user.id}`);
      } else {
        // Redirect to login if not authenticated
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message="Loading your profile..." />
    </div>
  );
}