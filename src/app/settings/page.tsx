'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

const SETTINGS_NAV = [
  { label: 'Account', href: '/settings', icon: '👤' },
  { label: 'Privacy', href: '/privacy', icon: '🔒' },
  { label: 'Notifications', href: '/settings/notifications', icon: '🔔' },
  { label: 'Help', href: '/settings/help', icon: '❓' },
];

export default function SettingsPage() {
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

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="section">
      <div className="section-container">
        {/* Navigation Tabs */}
        <SubNav items={SETTINGS_NAV} showBorder={true} />

        {/* Header */}
        <div className="section-header mb-8">
          <h1>Settings</h1>
          <p className="section-subtitle">Manage your account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-2">
                {SETTINGS_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Settings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Overview */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Overview</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{user.displayName || user.email}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Joined {formatJoinedDate(user.joinedDate || new Date().toISOString())}
                  </p>
                </div>
                <Link href={`/profile/${user.id}`} className="btn-primary">
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Account Settings */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Address</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">••••••••</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Account Status</h3>
                    <p className="text-sm text-gray-600">
                      {user.isSuspended ? (
                        <span className="text-red-600">Suspended</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900">Show profile publicly</p>
                    <p className="text-sm text-gray-600">Others can see your profile</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900">Show online status</p>
                    <p className="text-sm text-gray-600">Let others see when you're online</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900">Allow direct messages</p>
                    <p className="text-sm text-gray-600">Let anyone send you messages</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200 bg-red-50">
              <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium">
                  Export My Data
                </button>
                <button className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium">
                  Deactivate Account
                </button>
                <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium">
                  Delete Account Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
