'use client';

import { useState } from 'react';
import { Comment } from '@services/comment.service';
import CommentCard from './CommentCard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';

interface CommentListProps {
  comments: Comment[];
  replies: Record<string, Comment[]>;
  currentUserId: string;
  loading: boolean;
  error: string | null;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReply?: (parentCommentId: string, content: string) => Promise<void>;
  onLoadReplies?: (commentId: string) => Promise<void>;
  onUpvote?: (commentId: string, userId: string) => Promise<void>;
  onDownvote?: (commentId: string, userId: string) => Promise<void>;
  onLike?: (commentId: string, userId: string) => Promise<void>;
  onDislike?: (commentId: string, userId: string) => Promise<void>;
}

export default function CommentList({
  comments,
  replies,
  currentUserId,
  loading,
  error,
  onLoadMore,
  hasMore,
  onEdit,
  onDelete,
  onReply,
  onLoadReplies,
  onUpvote,
  onDownvote,
  onLike,
  onDislike,
}: CommentListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());

  const toggleReplySection = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const handleLoadReplies = async (commentId: string) => {
    if (onLoadReplies && !replies[commentId]) {
      setLoadingReplies((prev) => new Set([...prev, commentId]));
      try {
        await onLoadReplies(commentId);
      } finally {
        setLoadingReplies((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }
    }
  };

  if (loading && comments.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">Error loading comments: {error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onLoadReplies={() => handleLoadReplies(comment.id)}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onLike={onLike}
          onDislike={onDislike}
          replies={replies[comment.id] || []}
          repliesLoading={loadingReplies.has(comment.id)}
          showReplies={expandedComments.has(comment.id)}
          onToggleReplies={() => toggleReplySection(comment.id)}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
          >
            {loading ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}
    </div>
  );
}
