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

export default function NotificationsSettingsPage() {
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
            <h1 className="section-title">Notification Settings</h1>
            <p className="section-subtitle">Manage your notification preferences</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive push notifications in browser</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Community Updates</h3>
                <p className="text-sm text-gray-600">Get notified about community activities</p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Mentor Messages</h3>
                <p className="text-sm text-gray-600">Receive messages from mentors</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}