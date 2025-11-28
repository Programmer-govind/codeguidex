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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 h-full flex flex-col overflow-hidden group hover:-translate-y-1">
        {/* Card Header with Icon/Color */}
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {community.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {community.memberCount.toLocaleString()} members
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0"
            style={{
              backgroundColor: community.iconColor || '#3B82F6',
              background: community.iconColor ? `linear-gradient(135deg, ${community.iconColor}, ${adjustColor(community.iconColor, -20)})` : 'linear-gradient(135deg, #3B82F6, #2563EB)'
            }}
          >
            {community.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-4 flex-1">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        </div>

        {/* Badges */}
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          <Badge label={community.category} variant="secondary" size="sm" />
          <Badge
            label={community.visibility === 'private' ? 'Private' : 'Public'}
            variant={community.visibility === 'private' ? 'warning' : 'success'}
            size="sm"
          />
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 mt-auto">
          {isMember ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                onLeave?.(community.id);
              }}
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 disabled:opacity-50"
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
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-white shadow-sm transition-all duration-200 disabled:opacity-50 ${!isAuthenticated
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'
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
