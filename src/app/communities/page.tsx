/**
 * Communities List Page
 * Displays list of communities with filtering using Tailwind CSS
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchCommunities, useCommunityFilters, useCommunityMembership } from '@/hooks/useCommunity';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { CommunityCard } from '@/components/community/CommunityCard';
import { CommunityFilters } from '@/components/community/CommunityFilters';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'General', 'Other'];

export default function CommunitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { communities, totalCommunities, isLoading, error, fetchCommunities } =
    useFetchCommunities();
  const { setCategoryFilter, setVisibilityFilter, setSearchTerm } =
    useCommunityFilters();
  const { joinCommunity } = useCommunityMembership();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('public');
  const [searchTerm, setSearchTermLocal] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch communities for all users (public communities)
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCategoryFilter(category);
  };

  const handleVisibilityChange = (v: 'all' | 'public' | 'private') => {
    setVisibility(v);
    if (v !== 'all') {
      setVisibilityFilter(v);
    } else {
      setVisibilityFilter(null);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTermLocal(term);
    setSearchTerm(term);
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=/communities&action=join&communityId=${communityId}`);
      return;
    }

    if (!user) return;
    setJoiningId(communityId);
    try {
      joinCommunity(user.id, communityId);
      // Refresh communities
      setTimeout(() => fetchCommunities(), 500);
    } catch (err) {
      console.error('Failed to join community:', err);
    } finally {
      setJoiningId(null);
    }
  };

  const handleCreateCommunity = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/communities/create');
      return;
    }
    router.push('/communities/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white py-12 px-6 sm:px-8 lg:px-12 mb-16 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full -ml-20 -mb-20 blur-3xl mix-blend-overlay"></div>

        <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
              Discover <span className="text-indigo-200">Communities</span>
            </h1>
            <p className="text-base md:text-lg text-indigo-100 leading-relaxed">
              Connect with developers, share knowledge, and grow together in specialized communities designed for your stack.
            </p>
          </div>
          <button
            onClick={handleCreateCommunity}
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-base shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Community
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CommunityFilters
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              visibility={visibility}
              searchTerm={searchTerm}
              onCategoryChange={handleCategoryChange}
              onVisibilityChange={handleVisibilityChange}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Communities Grid */}
          <div className="lg:col-span-3">
            {error && <ErrorMessage message={error} type="error" />}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading communities...</p>
              </div>
            ) : communities.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No communities found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                  We couldn't find any communities matching your filters. Try adjusting your search or create a new community.
                </p>
                <button
                  onClick={() => {
                    handleCategoryChange(null);
                    handleSearchChange('');
                    handleVisibilityChange('all');
                  }}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {communities.map((community) => (
                  <div key={community.id} className="h-full">
                    <CommunityCard
                      community={community}
                      onJoin={handleJoinCommunity}
                      isLoading={joiningId === community.id}
                      isAuthenticated={isAuthenticated}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Info */}
            {communities.length > 0 && (
              <div className="mt-16 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{communities.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalCommunities}</span> communities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
