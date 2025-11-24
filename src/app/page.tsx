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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, show the landing page
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 px-6 overflow-hidden">
          <div className="container mx-auto text-center relative z-10">
            <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-4 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: Live Mentorship Sessions
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                Master Coding with <br />
                <span className="text-gradient">CodeGuideX</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
                A premium community for developers to learn, connect, and grow together.
                Join thousands of coders in our interactive ecosystem.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-delay-2">
                <a
                  href="/auth/signup"
                  className="btn-primary text-lg px-8 py-4 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="/auth/login"
                  className="btn-secondary text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  Existing Member
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white/50 backdrop-blur-sm border-t border-slate-200/60">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="glass-card p-8 rounded-2xl group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Q&A Support</h3>
                <p className="text-slate-600">Get answers to your coding doubts from experienced mentors and peers instantly.</p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-8 rounded-2xl group">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Communities</h3>
                <p className="text-slate-600">Join specialized groups for React, Python, AI, and more to connect with like-minded devs.</p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-8 rounded-2xl group">
                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Live Sessions</h3>
                <p className="text-slate-600">Attend interactive video workshops and code reviews with industry experts.</p>
              </div>

              {/* Feature 4 */}
              <div className="glass-card p-8 rounded-2xl group">
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Fast Growth</h3>
                <p className="text-slate-600">Accelerate your career with our structured learning paths and mentorship.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">10K+</div>
                <p className="text-slate-600 font-medium">Active Members</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">5K+</div>
                <p className="text-slate-600 font-medium">Questions Solved</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">500+</div>
                <p className="text-slate-600 font-medium">Daily Sessions</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // This should not be reached due to the redirect
  return null;
}
