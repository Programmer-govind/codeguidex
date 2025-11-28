/**
 * Create Community Page - Enhanced Enterprise Version
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCommunity } from '@/hooks/useCommunity';
import { CommunityForm } from '@/components/community/CommunityForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';
import type { CreateCommunityRequest } from '@/types/community.types';

const COMMUNITIES_NAV = [
  { label: 'Browse Communities', href: '/communities', icon: '👥' },
  { label: 'Create Community', href: '/communities/create', icon: '✨' },
  { label: 'My Communities', href: '/dashboard', icon: '📊' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function CreateCommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createCommunity } = useCreateCommunity();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: CreateCommunityRequest) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await createCommunity(data, user.id, user.displayName || 'Unknown User');
        router.push('/communities');
      } catch (err) {
        console.error('Failed to create community:', err);
        setError(err instanceof Error ? err.message : 'Failed to create community. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [user, createCommunity, router]
  );

  if (!user) {
    return (
      <div className="section">
        <div className="section-container">
          <LoadingSpinner message="Redirecting to login..." />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section">
        <div className="section-container">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Creating your community..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          {/* SubNav */}
          <SubNav items={COMMUNITIES_NAV} showBorder={true} />

          {/* Header */}
          <div className="section-header mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              🚀 Create New Community
            </h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Start a vibrant community to bring people together, share knowledge, collaborate on projects, and build meaningful connections.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-3xl mx-auto">
            {/* Error Alert */}
            {error && (
              <div className="card-lg border-2 border-red-200 bg-red-50 p-4 mb-8 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-900">Error Creating Community</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Container */}
            <div className="card-lg shadow-lg">
              <div className="mb-8 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Details</h2>
                <p className="text-gray-600 text-sm">Fill in the information about your new community</p>
              </div>

              <div className="p-6">
                <CommunityForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error || undefined}
                />
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-lg p-4">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Engaging Name</h3>
                <p className="text-xs text-gray-600">Choose a name that reflects your community's focus and attracts members</p>
              </div>
              <div className="card-lg p-4">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-semibold text-gray-900 mb-1">Clear Description</h3>
                <p className="text-xs text-gray-600">Describe your community's purpose and what members can expect</p>
              </div>
              <div className="card-lg p-4">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold text-gray-900 mb-1">Visual Identity</h3>
                <p className="text-xs text-gray-600">Use an icon color that represents your community's theme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
