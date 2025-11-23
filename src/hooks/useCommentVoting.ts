import { useCallback, useState } from 'react';
import { useComments } from './useComments';

export const useCommentVoting = (
  communityId: string,
  postId: string,
  userId: string
) => {
  const { upvote, downvote, unvote } = useComments(communityId, postId);
  const [votingCommentId, setVotingCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle upvote action
   */
  const handleUpvote = useCallback(
    async (commentId: string, currentVoteType?: 'upvote' | 'downvote') => {
      try {
        setVotingCommentId(commentId);
        setError(null);

        if (currentVoteType === 'upvote') {
          // Remove upvote
          await unvote(commentId, userId);
        } else {
          // Add or change to upvote
          await upvote(commentId, userId);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to upvote');
        console.error('Upvote error:', err);
      } finally {
        setVotingCommentId(null);
      }
    },
    [upvote, unvote, userId]
  );

  /**
   * Handle downvote action
   */
  const handleDownvote = useCallback(
    async (commentId: string, currentVoteType?: 'upvote' | 'downvote') => {
      try {
        setVotingCommentId(commentId);
        setError(null);

        if (currentVoteType === 'downvote') {
          // Remove downvote
          await unvote(commentId, userId);
        } else {
          // Add or change to downvote
          await downvote(commentId, userId);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to downvote');
        console.error('Downvote error:', err);
      } finally {
        setVotingCommentId(null);
      }
    },
    [downvote, unvote, userId]
  );

  /**
   * Get current vote type for a comment by user
   */
  const getCurrentVote = useCallback(
    (userVotes: Record<string, 'upvote' | 'downvote'>): 'upvote' | 'downvote' | null => {
      return userVotes?.[userId] || null;
    },
    [userId]
  );

  /**
   * Check if user has already voted
   */
  const hasVoted = useCallback(
    (userVotes: Record<string, 'upvote' | 'downvote'>): boolean => {
      return !!userVotes?.[userId];
    },
    [userId]
  );

  return {
    handleUpvote,
    handleDownvote,
    getCurrentVote,
    hasVoted,
    votingCommentId,
    error,
  };
};
