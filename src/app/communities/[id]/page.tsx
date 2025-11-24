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
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <ErrorMessage
          message={communityError || 'Community not found'}
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 pb-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Community Header */}
        <div className="glass-card rounded-3xl border border-gray-100 dark:border-gray-700 p-10 mb-12 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8">
            <div className="flex items-start gap-8 flex-1">
              {community.iconColor && (
                <div
                  className="w-28 h-28 rounded-2xl shadow-xl flex items-center justify-center text-white text-5xl font-bold shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${community.iconColor}, ${adjustColor(community.iconColor, -20)})`
                  }}
                >
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {community.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl text-lg leading-relaxed">
                  {community.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge label={community.category} variant="secondary" size="md" />
                  <Badge
                    label={community.visibility === 'private' ? 'Private' : 'Public'}
                    variant={community.visibility === 'private' ? 'warning' : 'success'}
                    size="md"
                  />
                </div>
                <div className="grid grid-cols-3 gap-6 max-w-md">
                  <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      {community.memberCount}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Members</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {community.stats.postsCount}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {community.stats.viewsCount}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Join/Leave Button */}
            <div className="lg:ml-auto">
              {user && community.ownerId === user.id ? (
                <button
                  disabled
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 rounded-xl cursor-not-allowed font-semibold border border-gray-300 shadow-sm"
                  title="Community owners cannot leave their community"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Owner
                  </span>
                </button>
              ) : isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={isJoining}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 font-semibold transition-all hover:shadow-lg"
                >
                  {isJoining ? 'Leaving...' : 'Leave Community'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  {isJoining ? 'Joining...' : 'Join Community'}
                </button>
              )}
            </div>
          </div>

          {/* Guidelines */}
          {community.guidelines && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Guidelines
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{community.guidelines}</p>
            </div>
          )}

          {/* Rules */}
          {community.rules && community.rules.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Rules
              </h3>
              <ol className="space-y-3">
                {community.rules.map((rule, idx) => (
                  <li key={idx} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Posts Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </span>
                Recent Posts
              </h2>
              {isMember && (
                <button
                  onClick={() => router.push(`/communities/${params.id}/posts/new`)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Post
                </button>
              )}
            </div>

            {loadingPosts ? (
              <LoadingSpinner message="Loading posts..." />
            ) : posts.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No posts yet in this community</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Be the first to start a discussion!</p>
              </div>
            ) : (
              <div className="space-y-6">
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
          <div className="lg:col-span-1 space-y-8">
            {/* Members */}
            <div className="glass-card rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Members
              </h3>
              <div className="space-y-4">
                {members && members.slice(0, 5).map((member: string, idx: number) => (
                  <div key={`member-${idx}`} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl p-3 -mx-3 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{member}</span>
                  </div>
                ))}
                {members && members.length > 5 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                    +{members.length - 5} more members
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {community.tags.length > 0 && (
              <div className="glass-card rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <Badge key={tag} label={tag} variant="primary" size="md" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to darken color for gradient
function adjustColor(color: string, amount: number) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
