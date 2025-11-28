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

export default function TrendingCommunitiesPage() {
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

  // TODO: Implement trending communities fetching logic
  const trendingCommunities: any[] = [];

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={COMMUNITIES_NAV_ITEMS} />

        <div className="section-header">
          <h1 className="section-title">Trending Communities</h1>
          <p className="section-subtitle">Popular communities gaining momentum</p>
        </div>

        {trendingCommunities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingCommunities.map((community) => (
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {community.growth} growth
                    </span>
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
            <div className="empty-state-icon">🔥</div>
            <h3 className="empty-state-title">No trending communities yet</h3>
            <p className="empty-state-description">
              Trending communities will appear here as they gain popularity. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}