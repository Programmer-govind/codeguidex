/**
 * Profile Card Component
 * Displays user profile information
 */

import { Badge } from '@/components/common/Badge';
import type { User } from '@/types/user.types';

interface ProfileCardProps {
  profile: User;
  stats?: {
    postsCount: number;
    communitiesJoined: number;
    followersCount: number;
    followingCount: number;
  };
  onEdit?: () => void;
  isOwnProfile?: boolean;
  isAuthenticated?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  stats,
  onEdit,
  isOwnProfile = false,
  isAuthenticated = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Header Background with Gradient */}
      <div className="h-32 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-end gap-4 -mt-16 mb-4">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={profile.displayName}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {isOwnProfile && isAuthenticated && (
            <button
              onClick={onEdit}
              className="ml-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {/* Name & Bio */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profile.displayName}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {profile.email}
        </p>
        {profile.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 my-6 py-6 border-y border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.postsCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.communitiesJoined}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Communities</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.followersCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.followingCount}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Following</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} label={skill} variant="primary" size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
