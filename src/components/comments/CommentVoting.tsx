'use client';

import { useState } from 'react';

interface CommentVotingProps {
  commentId: string;
  votes: {
    upvotes: number;
    downvotes: number;
    totalVotes: number;
  };
  userVotes: Record<string, 'upvote' | 'downvote'>;
  currentUserId: string;
  onUpvote?: (commentId: string, userId: string) => Promise<void>;
  onDownvote?: (commentId: string, userId: string) => Promise<void>;
}

export default function CommentVoting({
  commentId,
  votes,
  userVotes,
  currentUserId,
  onUpvote,
  onDownvote,
}: CommentVotingProps) {
  const [isVoting, setIsVoting] = useState(false);
  const currentVote = userVotes?.[currentUserId];

  const handleUpvote = async () => {
    if (isVoting || !onUpvote) return;
    setIsVoting(true);
    try {
      await onUpvote(commentId, currentUserId);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (isVoting || !onDownvote) return;
    setIsVoting(true);
    try {
      await onDownvote(commentId, currentUserId);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUpvote}
        disabled={isVoting}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
          currentVote === 'upvote'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>▲</span>
        <span>{votes.upvotes}</span>
      </button>

      <button
        onClick={handleDownvote}
        disabled={isVoting}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
          currentVote === 'downvote'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>▼</span>
        <span>{votes.downvotes}</span>
      </button>

      <span className="text-xs text-gray-500 ml-1">
        {votes.totalVotes > 0 ? `+${votes.totalVotes}` : votes.totalVotes}
      </span>
    </div>
  );
}
