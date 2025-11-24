/**
 * Post Card Component
 * Displays post preview in card format
 */

import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import type { Post } from '@/types/community.types';

interface PostCardProps {
  post: Post;
  communityId: string;
  userVote?: 'upvote' | 'downvote' | null;
  onVote?: (voteType: 'upvote' | 'downvote') => void;
  isVoting?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  communityId,
  userVote,
  onVote,
  isVoting = false,
}) => {
  return (
    <Link href={`/communities/${communityId}/posts/${post.id}`}>
      <div className="glass-card p-6 hover:shadow-lg transition-all">
        <div className="flex gap-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onVote?.('upvote');
              }}
              disabled={isVoting}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${userVote === 'upvote'
                ? 'text-green-500 bg-green-50'
                : 'text-gray-400'
                } disabled:opacity-50`}
            >
              ▲
            </button>
            <span className="text-xs font-semibold text-green-600">
              {post.votes.upvotes || 0}
            </span>

            <div className="w-px h-2 bg-gray-300"></div>

            <span className="text-xs font-semibold text-red-600">
              {post.votes.downvotes || 0}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                onVote?.('downvote');
              }}
              disabled={isVoting}
              className={`p-2 rounded hover:bg-gray-100 transition-colors ${userVote === 'downvote'
                ? 'text-red-500 bg-red-50'
                : 'text-gray-400'
                } disabled:opacity-50`}
            >
              ▼
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {post.title}
              </h3>
              {post.type === 'question' && post.isAnswered && (
                <Badge label="Answered" variant="success" size="sm" />
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 flex-wrap">
              <span>{post.authorName}</span>
              <span>•</span>
              <span>{post.views} views</span>
              <span>•</span>
              <span>{post.comments.count} comments</span>
              {post.sharedCount > 0 && (
                <>
                  <span>•</span>
                  <span>{post.sharedCount} shares</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge label={post.type} variant="secondary" size="sm" />
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} label={tag} variant="secondary" size="sm" />
              ))}
              {post.tags.length > 2 && (
                <Badge label={`+${post.tags.length - 2}`} variant="secondary" size="sm" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
