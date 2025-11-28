'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

const SETTINGS_NAV = [
  { label: 'Account', href: '/settings', icon: '👤' },
  { label: 'Privacy', href: '/privacy', icon: '🔒' },
  { label: 'Notifications', href: '/settings/notifications', icon: '🔔' },
  { label: 'Help', href: '/settings/help', icon: '❓' },
];

export default function HelpSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading settings..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={SETTINGS_NAV} />

        <div className="card-lg">
          <div className="section-header">
            <h1 className="section-title">Help & Support</h1>
            <p className="section-subtitle">Find answers to common questions and get support</p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">How do I join a community?</h4>
                  <p className="text-sm text-gray-600 mt-1">Browse communities and click "Join" to become a member.</p>
                </div>
                <div>
                  <h4 className="font-medium">How do I find a mentor?</h4>
                  <p className="text-sm text-gray-600 mt-1">Visit the Mentors page and browse available mentors by expertise.</p>
                </div>
                <div>
                  <h4 className="font-medium">How do I create a post?</h4>
                  <p className="text-sm text-gray-600 mt-1">Go to Posts and click "Create Post" to share your knowledge.</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Support</h3>
              <p className="text-gray-600 mb-4">
                Need more help? Contact our support team.
              </p>
              <button className="button-primary">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}