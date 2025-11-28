/**
 * User Profile Page - Enhanced Enterprise Version
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchProfile } from '@/hooks/useProfile';
import { useFetchCommunities } from '@/hooks/useCommunity';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { PostCard } from '@/components/post/PostCard';
import { PostService } from '@/services/post.service';
import { SubNav } from '@/components/navigation/SubNav';
import type { Post } from '@/types/community.types';

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const PROFILE_NAV = [
  { label: 'Profile', href: '/profile', icon: '👤' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Communities', href: '/communities', icon: '👥' },
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
];

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { profile, isLoading, error, fetchProfile } = useFetchProfile(params.id, currentUser);
  const { communities, fetchCommunities } = useFetchCommunities();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === params.id;

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch communities data
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const posts = await PostService.getUserPosts(params.id);
        setUserPosts(posts);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
        setPostsError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [params.id]);

  // Filter communities where user is a member
  const joinedCommunities = communities.filter(
    (community) => community.members && Object.prototype.hasOwnProperty.call(community.members, params.id)
  );

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="section">
        <div className="section-container">
          <ErrorMessage message={error || 'Profile not found'} type="error" />
        </div>
      </div>
    );
  }

  const stats = {
    postsCount: userPosts.length,
    communitiesJoined: joinedCommunities.length,
    followersCount: 0,
    followingCount: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          {/* SubNav - Tabbed Navigation */}
          <SubNav items={PROFILE_NAV} showBorder={true} />

          {/* Profile Header */}
          <div className="section-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isOwnProfile ? 'Your Profile' : profile.displayName}
            </h1>
            <p className="section-subtitle">
              {isOwnProfile ? 'Manage your profile and preferences' : 'View profile and contributions'}
            </p>
          </div>

          {/* Profile Grid - Sidebar + Main */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Profile Card + Communities */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <ProfileCard
                profile={profile}
                stats={stats}
                isOwnProfile={isOwnProfile}
                onEdit={() => {
                  if (isOwnProfile) {
                    router.push('/profile/edit');
                  }
                }}
                isAuthenticated={isAuthenticated}
              />

              {/* Communities Card */}
              <div className="card-lg">
                <div className="card-title flex items-center gap-2 mb-6">
                  <span className="text-xl">👥</span>
                  <span>Communities ({joinedCommunities.length})</span>
                </div>

                {joinedCommunities.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 text-sm">No communities joined yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {joinedCommunities.slice(0, 8).map((community) => (
                      <a
                        key={community.id}
                        href={`/communities/${community.id}`}
                        className="group block p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: community.iconColor || '#3B82F6' }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 truncate block text-sm">
                              {community.name}
                            </span>
                          </div>
                          <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </a>
                    ))}
                    {joinedCommunities.length > 8 && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-500 text-center">
                          +{joinedCommunities.length - 8} more communities
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="card-lg">
                <div className="card-title mb-4">📊 Quick Stats</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.postsCount}</div>
                    <div className="text-xs text-gray-600 mt-1">Posts</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{stats.communitiesJoined}</div>
                    <div className="text-xs text-gray-600 mt-1">Communities</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Posts */}
            <div className="lg:col-span-2">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>📝</span>
                  {isOwnProfile ? 'Your Posts' : `${profile.displayName}'s Posts`}
                </h2>
                <p className="text-gray-600">
                  {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'} published
                </p>
              </div>

              {/* Loading State */}
              {loadingPosts && (
                <div className="card-lg flex flex-col items-center justify-center py-16">
                  <LoadingSpinner />
                  <p className="text-gray-600 mt-4">Loading posts...</p>
                </div>
              )}

              {/* Error State */}
              {postsError && !loadingPosts && (
                <div className="card-lg border-2 border-red-200 bg-red-50 p-6 rounded-lg">
                  <ErrorMessage message={postsError} type="error" />
                </div>
              )}

              {/* Empty State */}
              {!loadingPosts && !postsError && userPosts.length === 0 && (
                <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No posts yet</h3>
                  <p className="text-blue-700 mb-4">
                    {isOwnProfile
                      ? "You haven't created any posts yet. Join a community and start sharing your knowledge!"
                      : "This user hasn't posted anything yet."}
                  </p>
                  {isOwnProfile && (
                    <a href="/communities" className="inline-block mt-4 button-primary">
                      Join a Community
                    </a>
                  )}
                </div>
              )}

              {/* Posts Grid */}
              {!loadingPosts && !postsError && userPosts.length > 0 && (
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      communityId={post.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
