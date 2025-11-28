'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SubNav, STUDENT_DASHBOARD_NAV, MENTOR_DASHBOARD_NAV, ADMIN_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function DashboardContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Determine which nav items to show based on user role
  let navItems = STUDENT_DASHBOARD_NAV;
  if (user?.role === 'mentor') {
    navItems = MENTOR_DASHBOARD_NAV;
  } else if (user?.role === 'admin') {
    navItems = ADMIN_DASHBOARD_NAV;
  }

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })}`;
  };

  return (
    <div className="section">
      <div className="section-container">
        {/* Navigation Tabs */}
        <SubNav items={navItems} showBorder={true} />

        {/* Header */}
        <div className="section-header mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl">Welcome back, {user?.displayName || 'User'}! 👋</h1>
          <p className="section-subtitle">
            {formatJoinedDate((user as any)?.createdAt || user?.joinedDate || new Date().toISOString())}
          </p>
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Profile Card */}
          <div className="card lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
                {user?.displayName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                  {user?.displayName || user?.email}
                </h2>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">{user?.email}</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium capitalize">
                    {user?.role || 'Student'}
                  </span>
                  {user?.isSuspended && (
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium">
                      Suspended
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/profile"
                className="w-full sm:w-auto mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-center text-sm sm:text-base"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {user?.stats?.postsCount || 0}
              </div>
              <p className="text-gray-600 text-sm">Posts Created</p>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {user?.stats?.communitiesJoined || 0}
                </div>
                <p className="text-gray-600 text-sm">Communities Joined</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/posts" className="card-interactive card text-center hover:border-blue-400">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900">Browse Posts</h3>
            <p className="text-sm text-gray-600 mt-1">View all posts</p>
          </Link>

          <Link href="/communities" className="card-interactive card text-center hover:border-blue-400">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">Communities</h3>
            <p className="text-sm text-gray-600 mt-1">Join communities</p>
          </Link>

          {user?.role !== 'mentor' && (
            <Link href="/mentors" className="card-interactive card text-center hover:border-blue-400">
              <div className="text-4xl mb-2">👨‍🏫</div>
              <h3 className="font-semibold text-gray-900">Find Mentors</h3>
              <p className="text-sm text-gray-600 mt-1">Get guidance</p>
            </Link>
          )}

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="card-interactive card text-center hover:border-red-400 transition-all disabled:opacity-50"
          >
            <div className="text-4xl mb-2">🚪</div>
            <h3 className="font-semibold text-gray-900">Logout</h3>
            <p className="text-sm text-gray-600 mt-1">Sign out</p>
          </button>
        </div>

        {/* Recent Activity Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/communities" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <h3 className="font-semibold text-gray-900">My Communities</h3>
              <p className="text-sm text-gray-600 mt-1">Communities you've joined</p>
            </Link>

            <Link href="/dashboard/posts" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <h3 className="font-semibold text-gray-900">My Posts</h3>
              <p className="text-sm text-gray-600 mt-1">Posts you've created</p>
            </Link>

            <Link href="/dashboard/bookmarks" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <h3 className="font-semibold text-gray-900">Bookmarks</h3>
              <p className="text-sm text-gray-600 mt-1">Saved content</p>
            </Link>

            <Link href="/notifications" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600 mt-1">Your notifications</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
