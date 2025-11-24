/**
 * User Profile Page
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
import type { Post } from '@/types/community.types';

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

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
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error || 'Profile not found'} type="error" />
      </div>
    );
  }

  const stats = {
    postsCount: userPosts.length,
    communitiesJoined: joinedCommunities.length,
    followersCount: 0, // TODO: Implement followers
    followingCount: 0, // TODO: Implement following
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
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

            {/* Communities */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Communities ({joinedCommunities.length})
              </h3>
              <div className="space-y-2">
                {joinedCommunities.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No communities joined yet
                  </p>
                ) : (
                  <>
                    {joinedCommunities.slice(0, 5).map((community) => (
                      <a
                        key={community.id}
                        href={`/communities/${community.id}`}
                        className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: community.iconColor || '#3B82F6' }}
                          />
                          <span className="font-medium truncate">{community.name}</span>
                        </div>
                      </a>
                    ))}
                    {joinedCommunities.length > 5 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center">
                        +{joinedCommunities.length - 5} more
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isOwnProfile ? 'Your Posts' : `${profile.displayName}'s Posts`}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'} published
              </p>
            </div>

            {loadingPosts ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
              </div>
            ) : postsError ? (
              <ErrorMessage message={postsError} type="error" />
            ) : userPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {isOwnProfile
                    ? "You haven't created any posts yet. Join a community and start sharing your knowledge!"
                    : "This user hasn't posted anything yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    communityId={post.id} // Note: We'd need to track communityId in posts for proper linking
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
