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
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="page-wrapper">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">CodeGuideX Dashboard</h1>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/profile"
                className="btn-outline text-sm px-4 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="page-wrapper">
          {/* Welcome Section */}
          <div className="dashboard-welcome-card mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to<br />
                <span className="text-gradient">Learn</span> • <span className="text-gradient">Connect</span> • <span className="text-gradient">Grow</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore communities, engage with posts, and connect with mentors in our vibrant learning ecosystem.
              </p>
            </div>
          </div>

          {/* User Info Card */}
          <section className="dashboard-card mb-8" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="text-xl font-bold mb-6 text-gray-900">Profile Information</h2>
            <div className="dashboard-profile-grid" role="list">
              <div className="profile-field" role="listitem" aria-labelledby="display-name-label">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span id="display-name-label" className="profile-label">Display Name</span>
                </div>
                <p className="profile-value" aria-describedby="display-name-label">{user?.displayName}</p>
              </div>

              <div className="profile-field" role="listitem" aria-labelledby="email-label">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span id="email-label" className="profile-label">Email Address</span>
                </div>
                <p className="profile-value" aria-describedby="email-label">{user?.email}</p>
              </div>

              <div className="profile-field" role="listitem" aria-labelledby="role-label">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span id="role-label" className="profile-label">Account Role</span>
                </div>
                <p className="profile-value capitalize" aria-describedby="role-label">{user?.role}</p>
              </div>

              <div className="profile-field" role="listitem" aria-labelledby="joined-label">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span id="joined-label" className="profile-label">Member Since</span>
                </div>
                <p className="profile-value" aria-describedby="joined-label">
                  Joined {user?.joinedDate ? formatJoinedDate(user.joinedDate) : 'N/A'}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="sr-only">Quick Actions</h2>
            <div className="dashboard-grid" role="list">
              <Link href="/posts" className="dashboard-action-card" aria-label="Browse and interact with community posts">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Browse Posts</h3>
                  <p className="text-gray-600 mb-4">
                    View and interact with community posts
                  </p>
                  <span className="btn-primary text-sm px-6 py-2 inline-block">Explore Posts</span>
                </div>
              </Link>

              <Link href="/communities" className="dashboard-action-card" aria-label="Find and join communities">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">Join Communities</h3>
                  <p className="text-gray-600 mb-4">
                    Connect with like-minded learners
                  </p>
                  <span className="btn-primary text-sm px-6 py-2 inline-block">Find Communities</span>
                </div>
              </Link>

              {user?.role === 'mentor' && (
                <Link href="/mentor/bookings" className="dashboard-action-card" aria-label="Manage mentoring sessions and bookings">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">Mentor Sessions</h3>
                    <p className="text-gray-600 mb-4">
                      Manage your mentoring sessions
                    </p>
                    <span className="btn-primary text-sm px-6 py-2 inline-block">View Bookings</span>
                  </div>
                </Link>
              )}
            </div>
          </section>
        </div>
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
