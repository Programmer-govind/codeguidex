/**
 * Community Card Component - Enterprise Level
 * Displays community information with enhanced styling and spacing
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

const adjustColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoin,
  onLeave,
  isMember = false,
  isLoading = false,
  isAuthenticated = true,
}) => {
  return (
    <div className="block h-full relative">
      <Link href={`/communities/${community.id}`} className="block h-full">
        <div className="community-card card-interactive">
          {/* Header Section */}
          <div className="community-card-header">
            <div
              className="community-icon"
              style={{
                backgroundColor: community.iconColor || '#3B82F6',
                background: community.iconColor
                  ? `linear-gradient(135deg, ${community.iconColor}, ${adjustColor(community.iconColor, -20)})`
                  : 'linear-gradient(135deg, #3B82F6, #2563EB)',
              }}
            >
              {community.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="community-card-title">
                {community.name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {community.category}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="community-card-body">
            <p className="community-card-description line-clamp-3">
              {community.description}
            </p>
          </div>

          {/* Stats Section */}
          <div className="community-card-stats">
            <div className="community-stat">
              <div className="community-stat-value">
                {(community.memberCount || 0).toLocaleString()}
              </div>
              <div className="community-stat-label">Members</div>
            </div>
            <div className="community-stat">
              <div className="community-stat-value">
                {(community.stats?.postsCount || 0).toLocaleString()}
              </div>
              <div className="community-stat-label">Posts</div>
            </div>
            <div className="community-stat">
              <div className="community-stat-value">
                {(community.stats?.commentsCount || 0).toLocaleString()}
              </div>
              <div className="community-stat-label">Comments</div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="community-card-footer">
            <Badge
              label={community.visibility === 'private' ? '🔒 Private' : '🌐 Public'}
              variant={community.visibility === 'private' ? 'warning' : 'success'}
              size="md"
            />
            {isMember && (
              <Badge
                label="✓ Member"
                variant="success"
                size="md"
              />
            )}
          </div>
        </div>
      </Link>

      {/* Action Button - Positioned absolutely over the card */}
      <div className="absolute bottom-2 left-2 right-2">
        {isMember ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLeave?.(community.id);
            }}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 hover:shadow-sm"
          >
            {isLoading ? '⏳ Leaving...' : '✕ Leave'}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onJoin?.(community.id);
            }}
            disabled={isLoading || !isAuthenticated}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 ${
              !isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-md active:scale-95'
            }`}
          >
            {isLoading ? '⏳ Joining...' : isAuthenticated ? '+ Join' : 'Login to Join'}
          </button>
        )}
      </div>
    </div>
  );
};
