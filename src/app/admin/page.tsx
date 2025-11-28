'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminService, RecentActivity } from '@/services/admin.service';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalCommunities: number;
  totalComments: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingReports: number;
}

// Mock data for charts
const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 900 },
  { name: 'Apr', users: 1200 },
  { name: 'May', users: 1500 },
  { name: 'Jun', users: 2100 },
  { name: 'Jul', users: 2800 },
];

const activityData = [
  { name: 'Mon', posts: 24, comments: 45 },
  { name: 'Tue', posts: 18, comments: 38 },
  { name: 'Wed', posts: 35, comments: 52 },
  { name: 'Thu', posts: 28, comments: 41 },
  { name: 'Fri', posts: 42, comments: 65 },
  { name: 'Sat', posts: 30, comments: 48 },
  { name: 'Sun', posts: 25, comments: 35 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCommunities: 0,
    totalComments: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    pendingReports: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/unauthorized');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch Stats
        const dashboardStats = await AdminService.getDashboardStats();
        setStats(dashboardStats);

        // 2. Fetch Activity
        try {
          const activity = await AdminService.getRecentActivity(5);
          setRecentActivity(activity);
        } catch (activityErr) {
          console.warn('Recent Activity fetch failed (likely missing index), using empty list');
        }

      } catch (err) {
        console.error('Critical Error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Show loading while checking auth
  if (authLoading || (isLoading && !user)) {
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

  // Access denied for non-admins is handled by useEffect redirect
  if (!user || user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: '📝',
      color: 'green',
    },
    {
      title: 'Communities',
      value: stats.totalCommunities.toLocaleString(),
      change: '+5%',
      trend: 'up',
      icon: '🏘️',
      color: 'purple',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports.toLocaleString(),
      change: stats.pendingReports > 0 ? 'Action Required' : 'All Clear',
      trend: stats.pendingReports > 0 ? 'alert' : 'good',
      icon: '⚠️',
      color: 'red',
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="section">
        <div className="section-container">
          {/* Header */}
          <div className="section-header mb-6 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="section-subtitle">Platform management and analytics</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="card-lg border-2 border-red-200 bg-red-50 p-4 mb-6 sm:mb-8 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-12">
            {statCards.map((card, idx) => (
              <div key={idx} className="card-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{card.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{card.value}</p>
                  </div>
                  <span className="text-2xl sm:text-3xl flex-shrink-0 ml-2">{card.icon}</span>
                </div>
                <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                  card.trend === 'up' ? 'bg-green-100 text-green-700' :
                  card.trend === 'alert' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {card.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-12">
            {/* User Growth Chart */}
            <div className="card-lg">
              <h3 className="card-title mb-4 sm:mb-6 text-base sm:text-lg">📈 User Growth (Last 7 months)</h3>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 10 }}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="card-lg">
              <h3 className="card-title mb-4 sm:mb-6 text-base sm:text-lg">📊 Weekly Activity</h3>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="posts" stackId="a" fill="#3B82F6" />
                    <Bar dataKey="comments" stackId="a" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          {recentActivity.length > 0 && (
            <div className="card-lg mb-6 sm:mb-12">
              <h3 className="card-title flex items-center gap-2 mb-4 sm:mb-6 text-base sm:text-lg">
                <span>⏱️</span> Recent Activity
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-b-0">
                    <div className="text-xl sm:text-2xl flex-shrink-0">
                      {activity.type === 'user_registered' && '👤'}
                      {activity.type === 'post_created' && '📝'}
                      {activity.type === 'comment_added' && '💬'}
                      {activity.type === 'report_submitted' && '⚠️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{activity.title}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <a href="/admin/users" className="card-lg hover:shadow-lg transition-shadow text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">👥</div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Manage Users</h4>
              <p className="text-xs sm:text-sm text-gray-600">Ban, suspend, or manage user accounts</p>
            </a>
            <a href="/admin/reports" className="card-lg hover:shadow-lg transition-shadow text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚠️</div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Pending Reports</h4>
              <p className="text-xs sm:text-sm text-gray-600">{stats.pendingReports} reports awaiting review</p>
            </a>
            <a href="/admin/communities" className="card-lg hover:shadow-lg transition-shadow text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏘️</div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Manage Communities</h4>
              <p className="text-xs sm:text-sm text-gray-600">Control community settings and moderation</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
