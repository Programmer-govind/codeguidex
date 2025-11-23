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
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Redirecting to login..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Create New Community
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
          Start a new community to bring people together, share knowledge, and collaborate on projects.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <CommunityForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}
