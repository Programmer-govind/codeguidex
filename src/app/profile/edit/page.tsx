/**
 * Edit Profile Page - Enhanced Enterprise Version
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchProfile, useUpdateProfile } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { SubNav } from '@/components/navigation/SubNav';
import type { User } from '@/types/user.types';

const PROFILE_NAV = [
  { label: 'View Profile', href: '/profile', icon: '👤' },
  { label: 'Edit Profile', href: '/profile/edit', icon: '✏️' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
];

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isLoading: loadingProfile, fetchProfile } = useFetchProfile(user?.id || null, user);
  const { updateProfile } = useUpdateProfile();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="card-lg max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Log In Required
          </h2>
          <p className="text-gray-600 mb-8">
            You need to log in to edit your profile
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="button-primary w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="section">
        <div className="section-container">
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading your profile..." />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="section">
        <div className="section-container">
          <ErrorMessage message="Profile not found" type="error" />
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<User>) => {
    try {
      setError(null);
      setSuccess(false);
      await updateProfile(user.id, data);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          {/* SubNav */}
          <SubNav items={PROFILE_NAV} showBorder={true} />

          {/* Header */}
          <div className="section-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="section-subtitle">Update your personal information and preferences</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Success Alert */}
            {success && (
              <div className="card-lg border-2 border-green-200 bg-green-50 p-4 mb-8 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-green-900">Profile Updated</h3>
                    <p className="text-green-700 text-sm">Your changes have been saved successfully</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="card-lg border-2 border-red-200 bg-red-50 p-4 mb-8 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-red-900">Error Updating Profile</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="card-lg shadow-lg">
              <div className="p-6 border-b border-gray-200 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>📝</span> Personal Information
                </h2>
                <p className="text-gray-600 text-sm mt-2">Keep your profile up to date</p>
              </div>

              <div className="p-6">
                <ProfileEditForm onSubmit={handleSubmit} profile={profile} />
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 card-lg p-6 bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span>💡</span> Profile Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Use a clear, professional profile photo</li>
                <li>• Write a compelling bio that highlights your expertise</li>
                <li>• Keep your contact information up to date</li>
                <li>• Add relevant links to your social profiles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
