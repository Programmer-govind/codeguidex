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
    console.log('AdminLoginPage: Auth state -', { isAuthenticated, isLoading, userRole: user?.role });

    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      console.log('AdminLoginPage: Redirecting admin to /admin');
      router.push('/admin');
    } else if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      console.log('AdminLoginPage: Redirecting non-admin to /unauthorized');
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user?.role]); // Removed router from dependencies

  // If still loading after 5 seconds, show the form anyway to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('AdminLoginPage: Loading timeout reached, showing form');
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