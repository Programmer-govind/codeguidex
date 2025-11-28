'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminAnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading analytics..." />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Mock analytics data
  const analytics = {
    totalUsers: 12543,
    activeUsers: 8921,
    totalCommunities: 456,
    totalPosts: 12890,
    userGrowth: '+12%',
    communityGrowth: '+8%',
    postGrowth: '+15%',
    topCommunities: [
      { name: 'Web Development', members: 2341, growth: '+5%' },
      { name: 'Data Science', members: 1890, growth: '+12%' },
      { name: 'Mobile Development', members: 1456, growth: '+3%' }
    ],
    userActivity: [
      { date: '2025-11-20', users: 1200 },
      { date: '2025-11-21', users: 1350 },
      { date: '2025-11-22', users: 1180 },
      { date: '2025-11-23', users: 1420 },
      { date: '2025-11-24', users: 1380 },
      { date: '2025-11-25', users: 1520 },
      { date: '2025-11-26', users: 1450 }
    ]
  };

  return (
    <div className="section">
      <div className="section-container">
        <div className="section-header">
          <h1 className="section-title">Analytics Dashboard</h1>
          <p className="section-subtitle">Platform performance and user insights</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <div className="text-gray-600">Total Users</div>
            <div className="text-green-600 text-sm">{analytics.userGrowth} growth</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold">{analytics.totalCommunities}</div>
            <div className="text-gray-600">Communities</div>
            <div className="text-green-600 text-sm">{analytics.communityGrowth} growth</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold">{analytics.totalPosts.toLocaleString()}</div>
            <div className="text-gray-600">Total Posts</div>
            <div className="text-green-600 text-sm">{analytics.postGrowth} growth</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Top Communities</h2>
            <div className="space-y-4">
              {analytics.topCommunities.map((community, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{community.name}</div>
                    <div className="text-sm text-gray-600">{community.members} members</div>
                  </div>
                  <div className="text-green-600 text-sm">{community.growth}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">User Activity (Last 7 Days)</h2>
            <div className="space-y-2">
              {analytics.userActivity.map((day, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(day.users / 1600) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{day.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}