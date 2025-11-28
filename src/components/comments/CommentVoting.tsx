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
  onLike?: (commentId: string, userId: string) => Promise<void>;
  onDislike?: (commentId: string, userId: string) => Promise<void>;
}

export default function CommentVoting({
  commentId,
  votes,
  userVotes,
  currentUserId,
  onLike,
  onDislike,
}: CommentVotingProps) {
  const [isVoting, setIsVoting] = useState(false);
  const currentVote = userVotes?.[currentUserId];

  const handleLike = async () => {
    if (isVoting || !onLike) return;
    setIsVoting(true);
    try {
      await onLike(commentId, currentUserId);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDislike = async () => {
    if (isVoting || !onDislike) return;
    setIsVoting(true);
    try {
      await onDislike(commentId, currentUserId);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={isVoting}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
          currentVote === 'upvote'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg className="w-4 h-4" fill={currentVote === 'upvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        <span className="text-xs">{votes.upvotes || 0}</span>
      </button>

      {/* Divider */}
      <div className="w-px h-3 bg-gray-300"></div>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        disabled={isVoting}
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition ${
          currentVote === 'downvote'
            ? 'bg-red-100 text-red-700'
            : 'text-gray-600 hover:bg-gray-100'
        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg className="w-4 h-4" fill={currentVote === 'downvote' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.764a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h-2" />
        </svg>
        <span className="text-xs">{votes.downvotes || 0}</span>
      </button>
    </div>
  );
}
