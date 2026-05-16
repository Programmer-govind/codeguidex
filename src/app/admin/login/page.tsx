'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.role === 'admin') {
      router.replace('/admin');
    } else if (isAuthenticated) {
      router.replace('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user?.role, router]);

  // If still loading after 5 seconds, show the form anyway to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner only while checking authentication status and not timed out
  if (isLoading && !showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated and is an admin, they would have been redirected above
  // If user is authenticated but not an admin, they would have been redirected above
  // So only unauthenticated users reach here
  return <LoginForm />;
}