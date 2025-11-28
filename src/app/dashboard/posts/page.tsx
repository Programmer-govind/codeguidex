'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SubNav } from '@/components/navigation/SubNav';
import { PostCard } from '@/components/post/PostCard';
import { DASHBOARD_NAV_ITEMS } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PostService } from '@/services/post.service';
import { useState } from 'react';
import type { Post } from '@/types/community.types';

export default function MyPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const userPosts = await PostService.getUserPosts(user.id);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 My Posts</h1>
            <p className="section-subtitle">Posts you've created in communities</p>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} communityId={post.id} />
              ))}
            </div>
          ) : (
            <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No Posts Yet</h3>
              <p className="text-blue-700 mb-6">
                Join a community and start creating posts to share your knowledge
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="/communities" className="button-primary">
                  Browse Communities
                </a>
                <a href="/posts" className="button-secondary">
                  View All Posts
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
