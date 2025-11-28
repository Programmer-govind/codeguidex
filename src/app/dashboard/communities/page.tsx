'use client';

import { useEffect, useState } from 'react';
import { useFetchCommunities, useCommunityMembership } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { SubNav } from '@/components/navigation/SubNav';
import { CommunityCard } from '@/components/community/CommunityCard';
import { DASHBOARD_NAV_ITEMS } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function MyCommunitiesPage() {
  const { user, isAuthenticated } = useAuth();
  const { communities, isLoading, fetchCommunities } = useFetchCommunities(user?.id);
  const { joinCommunity, leaveCommunity } = useCommunityMembership();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCommunities();
    }
  }, [fetchCommunities, isAuthenticated, user]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!isAuthenticated || !user) return;
    setJoiningId(communityId);
    try {
      console.log('Joining community from dashboard:', communityId);
      await joinCommunity(user.id, communityId);
      // Refetch communities to update the list
      setTimeout(async () => {
        await fetchCommunities();
      }, 500);
    } catch (err) {
      console.error('Failed to join community:', err);
    } finally {
      setJoiningId(null);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;
    setLeavingId(communityId);
    try {
      console.log('Leaving community from dashboard:', communityId);
      await leaveCommunity(user.id, communityId);
      // Refetch communities to update the list
      setTimeout(async () => {
        await fetchCommunities();
      }, 500);
    } catch (err) {
      console.error('Failed to leave community:', err);
    } finally {
      setLeavingId(null);
    }
  };

  // Filter communities to only show those the user is a member of
  const myCommunities = communities.filter(community =>
    community.members && typeof community.members === 'object' && user?.id && user.id in community.members
  );

  console.log('Dashboard My Communities:', {
    userId: user?.id,
    totalCommunities: communities.length,
    myCommunitiesCount: myCommunities.length,
    myCommunities: myCommunities.map(c => ({ name: c.name, id: c.id }))
  });

  if (isLoading) {
    return (
      <div className="section">
        <div className="section-container">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          <SubNav items={DASHBOARD_NAV_ITEMS} showBorder={true} />

          <div className="section-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 My Communities</h1>
            <p className="section-subtitle">Communities you've joined or created</p>
          </div>

          {myCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onJoin={() => handleJoinCommunity(community.id)}
                  onLeave={() => handleLeaveCommunity(community.id)}
                  isLoading={joiningId === community.id || leavingId === community.id}
                  isAuthenticated={isAuthenticated}
                  isMember={true} // All communities shown here are ones user is member of
                />
              ))}
            </div>
          ) : (
            <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No Communities Yet</h3>
              <p className="text-blue-700 mb-6">
                Join or create a community to connect with others and share knowledge
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="/communities" className="button-primary">
                  Browse Communities
                </a>
                <a href="/communities/create" className="button-secondary">
                  Create Community
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
