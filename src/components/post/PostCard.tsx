/**
 * Post Card Component - Enterprise Level
 * Displays post preview in card format with enhanced styling
 */

import Link from 'next/link';
import { Badge } from '@/components/common/Badge';
import type { Post } from '@/types/community.types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  communityId: string;
  userVote?: 'upvote' | 'downvote' | null;
  onVote?: (voteType: 'upvote' | 'downvote') => void;
  isVoting?: boolean;
}

const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  switch (type) {
    case 'question':
      return 'primary';
    case 'discussion':
      return 'secondary';
    case 'resource':
      return 'success';
    default:
      return 'primary';
  }
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  communityId,
  userVote,
  onVote,
  isVoting = false,
}) => {
  const createdDate = post.createdAt instanceof Object && 'seconds' in post.createdAt
    ? new Date(post.createdAt.seconds * 1000)
    : new Date(post.createdAt as unknown as string);

  return (
    <Link href={`/communities/${communityId}/posts/${post.id}`}>
      <div className="post-card">
        {/* Voting Section */}
        <div className="vote-section">
          <button
            onClick={(e) => {
              e.preventDefault();
              onVote?.('upvote');
            }}
            disabled={isVoting}
            className={`vote-button ${userVote === 'upvote' ? 'active-upvote' : ''}`}
            aria-label="Upvote"
          >
            ▲
          </button>
          <div className="vote-count">
            {post.votes.totalVotes || 0}
          </div>
          <div className="vote-divider"></div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onVote?.('downvote');
            }}
            disabled={isVoting}
            className={`vote-button ${userVote === 'downvote' ? 'active-downvote' : ''}`}
            aria-label="Downvote"
          >
            ▼
          </button>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          <div className="post-card-header">
            <div className="flex-1">
              <h3 className="post-card-title">
                {post.title}
              </h3>
              {post.type === 'question' && post.isAnswered && (
                <div style={{ marginTop: '0.5rem' }}>
                  <Badge label="✓ Answered" variant="success" size="sm" />
                </div>
              )}
            </div>
          </div>

          <p className="post-card-description line-clamp-2">
            {post.description}
          </p>

          <div className="post-card-meta">
            <span className="font-medium text-gray-700">{post.authorName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            <span>•</span>
            <span>👁 {post.views} views</span>
            <span>•</span>
            <span>💬 {post.comments.count} comments</span>
            {post.sharedCount > 0 && (
              <>
                <span>•</span>
                <span>🔗 {post.sharedCount} shares</span>
              </>
            )}
          </div>

          <div className="post-tags">
            <Badge label={post.type} variant={getTypeColor(post.type)} size="md" />
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} label={tag} variant="primary" size="md" />
            ))}
            {post.tags.length > 3 && (
              <Badge label={`+${post.tags.length - 3}`} variant="secondary" size="sm" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
