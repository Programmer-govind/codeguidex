'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard', href: '/admin', icon: '📊'
    },
    {
      name: 'Users', href: '/admin/users', icon: '👥'
    },
    {
      name: 'Posts', href: '/admin/posts', icon: '📝'
    },
    {
      name: 'Reports', href: '/admin/reports', icon: '⚠️'
    },
    {
      name: 'Communities', href: '/admin/communities', icon: '🏘️'
    },
    {
      name: 'Analytics', href: '/admin/analytics', icon: '📈'
    },
    {
      name: 'Profile', href: '/profile', icon: '👤'
    },
    {
      name: 'Settings', href: '/admin/settings', icon: '⚙️'
    },
  ];

  // Don't apply protection to the login page
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CG</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the admin panel
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex flex-col font-sans">
        {/* Global Header/Navbar */}
        <header className="h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                C
              </div>
              <span className="hidden sm:inline font-bold text-lg sm:text-xl text-secondary-900 dark:text-white tracking-tight">
                CodeGuideX Admin
              </span>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium whitespace-nowrap
                      transition-all duration-200 ease-out
                      border-b-2 -mb-px
                      flex items-center gap-2
                      ${
                        isActive
                          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Current Page Title - Hidden on mobile */}
            <div className="hidden xl:block">
              <h1 className="text-sm sm:text-lg font-semibold text-secondary-900 dark:text-white">
                {navigation.find(n => n.href === pathname)?.name || 'Admin Panel'}
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user?.displayName?.[0] || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.displayName}
                </p>
                <p className="text-xs text-secondary-500">Administrator</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-secondary-400 hover:text-danger-600 transition-colors rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}