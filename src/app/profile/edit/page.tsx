/**
 * Edit Profile Page
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFetchProfile, useUpdateProfile } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import type { User } from '@/types/user.types';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isLoading: loadingProfile } = useFetchProfile(user?.id || null);
  const { updateProfile } = useUpdateProfile();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to edit your profile</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return <LoadingSpinner fullPage message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Profile not found" type="error" />
      </div>
    );
  }

  const handleSubmit = async (data: Partial<User>) => {
    try {
      await updateProfile(user.id, data);
      router.push(`/profile/${user.id}`);
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your profile information</p>
      </div>

      <ProfileEditForm onSubmit={handleSubmit} profile={profile} />
    </div>
  );
}
