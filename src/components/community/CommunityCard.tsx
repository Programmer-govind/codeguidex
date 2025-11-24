/**
 * Community Card Component
 * Displays community information in card format using Tailwind CSS
 */

import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import type { Community } from '@/types/community.types';

interface CommunityCardProps {
  community: Community;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  isMember?: boolean;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoin,
  onLeave,
  isMember = false,
  isLoading = false,
  isAuthenticated = true,
}) => {
  return (
    <Link href={`/communities/${community.id}`} className="block h-full">
      <div className="glass-card rounded-2xl transition-all duration-300 h-full flex flex-col overflow-hidden group hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700">
        {/* Card Header with Icon/Color */}
        <div className="p-8 flex items-start justify-between gap-4 relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="flex-1 min-w-0 relative z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
              {community.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {community.memberCount.toLocaleString()} members
            </p>
          </div>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10"
            style={{
              backgroundColor: community.iconColor || '#3B82F6',
              background: community.iconColor ? `linear-gradient(135deg, ${community.iconColor}, ${adjustColor(community.iconColor, -20)})` : 'linear-gradient(135deg, #3B82F6, #2563EB)'
            }}
          >
            {community.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Description */}
        <div className="px-8 pb-6 flex-1">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        </div>

        {/* Badges */}
        <div className="px-8 pb-6 flex flex-wrap gap-2">
          <Badge label={community.category} variant="secondary" size="sm" />
          <Badge
            label={community.visibility === 'private' ? 'Private' : 'Public'}
            variant={community.visibility === 'private' ? 'warning' : 'success'}
            size="sm"
          />
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/30 mt-auto">
          {isMember ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                onLeave?.(community.id);
              }}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 disabled:opacity-50 hover:shadow-md"
            >
              {isLoading ? 'Leaving...' : 'Leave Community'}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                onJoin?.(community.id);
              }}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all duration-200 disabled:opacity-50 hover:shadow-xl ${!isAuthenticated
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:transform active:scale-95'
                }`}
            >
              {isLoading ? 'Joining...' : isAuthenticated ? 'Join Community' : 'Login to Join'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

// Helper to darken color for gradient
function adjustColor(color: string, amount: number) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
