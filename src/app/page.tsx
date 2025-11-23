'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show the landing page
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="py-section px-section">
          <div className="content-wrapper">
            {/* Main Content */}
            <div className="text-center space-y-xl max-w-5xl mx-auto">
              {/* Title */}
              <div className="space-y-lg">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <span className="text-gradient">CodeGuideX</span>
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Learn, Connect, Grow
                </p>
              </div>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A beginner-friendly platform to post doubts, join communities, interact with mentors, and attend live video sessions.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-soft hover:shadow-md-soft transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Ask & Answer Questions</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-soft hover:shadow-md-soft transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Join Communities</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-soft hover:shadow-md-soft transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Connect with Mentors</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-soft hover:shadow-md-soft transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium">Live Video Sessions</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-xl">
                <a
                  href="/auth/login"
                  className="btn-primary px-10 py-4 sm:px-12 sm:py-5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3zm0 4a1 1 0 011-1h12a1 1 0 011 1H3z" clipRule="evenodd" />
                  </svg>
                  Login to Your Account
                </a>
                <a
                  href="/auth/signup"
                  className="btn-outline px-10 py-4 sm:px-12 sm:py-5 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Create New Account
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white border-t border-b border-gray-200 py-section px-section">
          <div className="content-wrapper">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <p className="text-lg text-gray-600 font-medium">Active Members</p>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">5K+</div>
                <p className="text-lg text-gray-600 font-medium">Questions Answered</p>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">500+</div>
                <p className="text-lg text-gray-600 font-medium">Active Communities</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // This should not be reached due to the redirect, but just in case
  return null;
}
