'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchCommunities, useCommunityMembership } from '@/hooks/useCommunity';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { CommunityCard } from '@/components/community/CommunityCard';
import { SubNav, COMMUNITIES_NAV_ITEMS } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function MyCommunitiesPage() {

  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { communities, isLoading, error, fetchCommunities } = useFetchCommunities(user?.id);
  const { leaveCommunity } = useCommunityMembership();

  const [leavingId, setLeavingId] = useState<string | null>(null);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    if (isAuthenticated && user && !hasFetched.current) {
      hasFetched.current = true;
      fetchCommunities();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user?.id]);

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;
    setLeavingId(communityId);
    try {
      await leaveCommunity(user.id, communityId);
      // Small delay to ensure Firestore consistency, then refetch
      setTimeout(async () => {
        await fetchCommunities();
      }, 500);
    } catch (err) {
      console.error('Failed to leave community:', err);
    } finally {
      setLeavingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your communities..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filter communities to only show those the user is a member of
  const myCommunities = communities.filter(community => {
    const isMember = community.members && typeof community.members === 'object' && user.id in community.members;
    return isMember;
  });


  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={COMMUNITIES_NAV_ITEMS} showBorder={true} />

        <div className="section-header mb-8">
          <h1 className="section-title">My Communities</h1>
          <p className="section-subtitle">Communities you're a member of</p>
        </div>

        {error && <ErrorMessage message={error} />}

        {myCommunities.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No communities yet</h3>
            <p className="empty-state-description">
              Join communities to connect with like-minded people and share knowledge.
            </p>
            <button
              onClick={() => router.push('/communities')}
              className="btn-primary mt-4"
            >
              Explore Communities
            </button>
          </div>
        ) : (
          <>
            <div className="grid-cards-2">
              {myCommunities.map((community) => {
                return (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onJoin={() => {}} // Not needed for "My Communities" page
                  onLeave={() => handleLeaveCommunity(community.id)}
                  isLoading={leavingId === community.id}
                  isAuthenticated={true}
                  isMember={true} // All communities shown here should be ones user is member of
                />
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-900">{myCommunities.length}</span>
                {' '}communit{myCommunities.length !== 1 ? 'ies' : 'y'} you're a member of
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}