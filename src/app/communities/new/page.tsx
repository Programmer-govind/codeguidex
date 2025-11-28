'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

const COMMUNITIES_NAV_ITEMS = [
  { label: 'Explore All', href: '/communities', icon: '🌍' },
  { label: 'My Communities', href: '/communities/my', icon: '⭐' },
  { label: 'Trending', href: '/communities/trending', icon: '🔥' },
  { label: 'New', href: '/communities/new', icon: '✨' },
];

export default function NewCommunitiesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading communities..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // TODO: Implement new communities fetching logic
  const newCommunities: any[] = [];

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={COMMUNITIES_NAV_ITEMS} />

        <div className="section-header">
          <h1 className="section-title">New Communities</h1>
          <p className="section-subtitle">Recently created communities</p>
        </div>

        {newCommunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newCommunities.map((community) => (
              <div key={community.id} className="card-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{community.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{community.description}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                      <span>{community.members} members</span>
                      <span>{community.posts} posts</span>
                    </div>
                    <span className="text-xs text-gray-400">Created {community.createdAt}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/communities/${community.id}`}
                    className="button-primary w-full text-center block"
                  >
                    Join Community
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">✨</div>
            <h3 className="empty-state-title">No new communities yet</h3>
            <p className="empty-state-description">
              New communities will appear here as they are created. Be the first to create one!
            </p>
            <Link href="/communities/create" className="btn-primary mt-4">
              Create Community
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}