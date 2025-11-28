'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchCommunities, useCommunityFilters, useCommunityMembership } from '@/hooks/useCommunity';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { CommunityCard } from '@/components/community/CommunityCard';
import { SubNav, COMMUNITIES_NAV_ITEMS } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'General', 'Other'];

export default function CommunitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { communities, isLoading, error, fetchCommunities } = useFetchCommunities(user?.id);
  const { setCategoryFilter, setVisibilityFilter, setSearchTerm } = useCommunityFilters();
  const { joinCommunity, leaveCommunity } = useCommunityMembership();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('public');
  const [searchTerm, setSearchTermLocal] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
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
      router.push(`/auth/login?redirect=/communities&action=join&communityId=${communityId}`);
      return;
    }

    if (!user) return;

    setJoiningId(communityId);

    try {
      await joinCommunity(user.id, communityId);

      // Small delay to ensure Firestore consistency, then refetch
      setTimeout(async () => {
        await fetchCommunities();
      }, 1000); // Increased delay
    } catch (err) {
      console.error('Failed to join community:', err);
      alert(`Failed to join community: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;
    try {
      await leaveCommunity(user.id, communityId);
      // Refetch communities to ensure the members field is updated
      setTimeout(async () => {
        await fetchCommunities();
      }, 500);
    } catch (err) {
      console.error('Failed to leave community:', err);
      alert(`Failed to leave community: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    <div className="section">
      <div className="section-container">
        {/* Navigation Tabs */}
        <SubNav items={COMMUNITIES_NAV_ITEMS} showBorder={true} />

        {/* Hero Header */}
        <div className="section-header mb-8">
          <h1>Discover Communities</h1>
          <p className="section-subtitle">
            Connect with developers, share knowledge, and grow together in specialized communities.
          </p>
          <button
            onClick={handleCreateCommunity}
            className="btn-primary mt-4"
          >
            + Create Community
          </button>
        </div>

        {/* Filters Card */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="form-group">
              <label className="form-label">Search Communities</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name or description..."
                className="form-input"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(e.target.value || null)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div className="form-group">
              <label className="form-label">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => handleVisibilityChange(e.target.value as any)}
                className="form-select"
              >
                <option value="all">All Communities</option>
                <option value="public">Public Only</option>
                <option value="private">Private Only</option>
              </select>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} type="error" />
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="empty-state card">
            <LoadingSpinner />
            <p className="empty-state-description">Loading communities...</p>
          </div>
        ) : communities.length === 0 ? (
          /* Empty State */
          <div className="empty-state card">
            <div className="empty-state-icon">🏢</div>
            <h3 className="empty-state-title">No communities found</h3>
            <p className="empty-state-description">
              {selectedCategory || searchTerm
                ? 'Try adjusting your filters to find communities.'
                : 'Be the first to create a community!'}
            </p>
            <button onClick={handleCreateCommunity} className="btn-primary mt-4">
              Create Community
            </button>
          </div>
        ) : (
          /* Communities Grid */
          <>
            <div className="grid-cards-2">
              {communities.map((community) => {
                const userId = user?.id;
                const hasMembers = community.members && typeof community.members === 'object';
                const userInMembers = hasMembers && userId && userId in community.members;
                const isMemberCheck = !!(user && hasMembers && userInMembers);
                return (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onJoin={() => handleJoinCommunity(community.id)}
                  onLeave={() => handleLeaveCommunity(community.id)}
                  isLoading={joiningId === community.id}
                  isAuthenticated={isAuthenticated}
                  isMember={isMemberCheck}
                />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
