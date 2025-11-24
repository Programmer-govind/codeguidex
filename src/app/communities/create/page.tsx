/**
 * Create Community Page
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCommunity } from '@/hooks/useCommunity';
import { CommunityForm } from '@/components/community/CommunityForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { CreateCommunityRequest } from '@/types/community.types';

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
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <LoadingSpinner message="Redirecting to login..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Create New Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Start a new community to bring people together, share knowledge, and collaborate on projects.
          </p>
        </div>

        <div className="glass-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 md:p-12">
          <CommunityForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error || undefined}
          />
        </div>
      </div>
    </div>
  );
}
