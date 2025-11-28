'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Don't show loading spinner - let the LoginForm handle its own loading state
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <LoginForm />;
}