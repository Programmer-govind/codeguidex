'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function DashboardContent() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/');
    }
  };

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })}`;
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              C
            </div>
            <span className="font-bold text-xl text-secondary-900 dark:text-white tracking-tight">
              CodeGuideX
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary-900 dark:bg-secondary-700 rounded-lg hover:bg-secondary-800 dark:hover:bg-secondary-600 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 p-8 md:p-12 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white drop-shadow-sm">
              Welcome back, {user?.displayName}! 👋
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium drop-shadow-sm">
              Ready to <span className="font-bold text-white border-b-2 border-white/30 pb-0.5">Learn</span>, <span className="font-bold text-white border-b-2 border-white/30 pb-0.5">Connect</span>, and <span className="font-bold text-white border-b-2 border-white/30 pb-0.5">Grow</span>?
              Explore communities, engage with posts, and connect with mentors in our vibrant ecosystem.
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <section className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-soft p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Profile Information</h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Your personal account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-700/30 border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
              <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-1">Display Name</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 transition-colors">{user?.displayName}</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-700/30 border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
              <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">{user?.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-700/30 border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
              <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-1">Account Role</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white capitalize group-hover:text-primary-600 transition-colors">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                  {user?.role}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-700/30 border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
              <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 transition-colors">
                {user?.joinedDate ? formatJoinedDate(user.joinedDate).replace('Joined ', '') : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/posts" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">Browse Posts</h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                View latest discussions, ask questions, and interact with the community.
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                Explore Posts
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link href="/communities" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">Join Communities</h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                Find and join topic-based groups to connect with like-minded learners.
              </p>
              <div className="flex items-center text-green-600 font-medium text-sm">
                Find Communities
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {user?.role === 'mentor' && (
              <>
                <Link href="/dashboard/mentor/bookings" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">Mentor Sessions</h3>
                  <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                    Manage your upcoming bookings and past sessions.
                  </p>
                  <div className="flex items-center text-purple-600 font-medium text-sm">
                    View Bookings
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link href="/dashboard/mentor/videos" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">My Videos</h3>
                  <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                    Upload and manage your tutorial videos for students.
                  </p>
                  <div className="flex items-center text-red-600 font-medium text-sm">
                    Manage Videos
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </>
            )}

            {/* Student Actions - Available to all users */}
            <Link href="/mentors" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">Find Mentors</h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                Browse and book sessions with expert mentors in various fields.
              </p>
              <div className="flex items-center text-orange-600 font-medium text-sm">
                Browse Mentors
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link href="/dashboard/student/bookings" className="group bg-white dark:bg-secondary-800 rounded-2xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors">My Bookings</h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4 line-clamp-2">
                View and manage your scheduled mentor sessions.
              </p>
              <div className="flex items-center text-teal-600 font-medium text-sm">
                View Sessions
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </section>
      </main>
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
