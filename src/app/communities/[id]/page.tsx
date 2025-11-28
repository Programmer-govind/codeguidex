/**
 * Community Detail Page
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchCommunity, useCommunityMembership, useCommunityMembers } from '@/hooks/useCommunity';
import { useFetchPosts } from '@/hooks/usePost';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Badge } from '@/components/common/Badge';
import { PostCard } from '@/components/post/PostCard';

interface CommunityDetailPageProps {
  params: {
    id: string;
  };
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { community, isLoading: loadingCommunity, error: communityError, fetchCommunity } =
    useFetchCommunity(params.id);
  const { posts, isLoading: loadingPosts, fetchPosts } = useFetchPosts(params.id);
  const { fetchMembers } = useCommunityMembers(params.id);
  const { joinCommunity, leaveCommunity } = useCommunityMembership();

  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [members, setMembers] = useState<string[]>([]);

  // Fetch community data
  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  // Fetch posts data
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (community && user) {
      // Check if members object exists and user is in it
      const isUserMember = community.members && Object.prototype.hasOwnProperty.call(community.members, user.id);
      setIsMember(!!isUserMember);
    }
  }, [community, user]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersList = await fetchMembers();
        setMembers(membersList.map((m) => m.displayName));
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };
    loadMembers();
  }, [fetchMembers]);

  const handleJoin = async () => {
    if (!user) return;
    setIsJoining(true);
    try {
      await joinCommunity(user.id, params.id);
      setIsMember(true);
      // Refetch community to update member count and membership status
      await fetchCommunity();
    } catch (err) {
      console.error('Failed to join community:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    setIsJoining(true);
    try {
      await leaveCommunity(user.id, params.id);
      setIsMember(false);
      // Refetch community to update member count and membership status
      await fetchCommunity();
    } catch (err) {
      console.error('Failed to leave community:', err);
    } finally {
      setIsJoining(false);
    }
  };

  if (loadingCommunity) {
    return <LoadingSpinner fullPage message="Loading community..." />;
  }

  if (communityError || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={communityError || 'Community not found'}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Community Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-6">
            {community.iconColor && (
              <div
                className="w-24 h-24 rounded-lg"
                style={{ backgroundColor: community.iconColor }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {community.name}
              </h1>
              <p className="text-gray-600 mb-4 max-w-2xl">{community.description}</p>
              <div className="flex gap-2 mb-4">
                <Badge label={community.category} variant="secondary" />
                <Badge
                  label={
                    community.visibility === 'private' ? 'Private' : 'Public'
                  }
                  variant={
                    community.visibility === 'private' ? 'warning' : 'success'
                  }
                />
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <p className="font-semibold">{community.memberCount}</p>
                  <p>Members</p>
                </div>
                <div>
                  <p className="font-semibold">{community.stats.postsCount}</p>
                  <p>Posts</p>
                </div>
                <div>
                  <p className="font-semibold">{community.stats.viewsCount}</p>
                  <p>Views</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join/Leave Button */}
          <div>
            {user && community.ownerId === user.id ? (
              <button
                disabled
                className="px-6 py-3 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed font-medium border border-gray-200"
                title="Community owners cannot leave their community"
              >
                Owner
              </button>
            ) : isMember ? (
              <button
                onClick={handleLeave}
                disabled={isJoining}
                className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 font-medium transition-colors"
              >
                {isJoining ? 'Leaving...' : 'Leave Community'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm transition-colors"
              >
                {isJoining ? 'Joining...' : 'Join Community'}
              </button>
            )}
          </div>
        </div>

        {/* Guidelines */}
        {community.guidelines && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Guidelines</h3>
            <p className="text-gray-600 text-sm">{community.guidelines}</p>
          </div>
        )}

        {/* Rules */}
        {community.rules && community.rules.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Rules</h3>
            <ol className="space-y-2">
              {community.rules.map((rule, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-3">
                  <span className="font-semibold text-gray-900">{idx + 1}.</span>
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
            {isMember && (
              <button
                onClick={() => router.push(`/communities/${params.id}/posts/new`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                + New Post
              </button>
            )}
          </div>

          {loadingPosts ? (
            <LoadingSpinner message="Loading posts..." />
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No posts yet in this community</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  communityId={params.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Members */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Members</h3>
            <div className="space-y-3">
              {members && members.slice(0, 5).map((member: string, idx: number) => (
                <div key={`member-${idx}`} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <span className="text-sm text-gray-600">{member}</span>
                </div>
              ))}
              {members && members.length > 5 && (
                <p className="text-xs text-gray-500 pt-2">
                  +{members.length - 5} more members
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {community.tags.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag) => (
                  <Badge key={tag} label={tag} variant="primary" size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
