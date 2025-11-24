// Signup Form – Full‑Screen Premium Layout
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignup } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { SignupRequest } from '@/types/auth.types';

export default function SignupForm() {
  const router = useRouter();
  const { signup, isSigningUp, error } = useSignup();
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signup(formData);
      router.push('/auth/login');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 flex flex-col">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Sign Up</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Join the CodeGuideX community – learn, connect, and grow together.
        </p>
      </header>

      {/* Form – occupies remaining space */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-4xl p-10 md:p-12 space-y-8"
        >
          {error && <ErrorMessage message={error} type="error" />}

          {/* Display Name */}
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Your name..."
              required
              disabled={isSigningUp}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isSigningUp}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isSigningUp}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isSigningUp}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 dark:bg-gray-800/50 dark:text-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
          >
            {isSigningUp ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Signing Up...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
