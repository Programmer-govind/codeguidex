/**
 * Post Voting Component
 * Handles post voting interactions
 */

interface PostVotingProps {
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  userVote?: 'upvote' | 'downvote' | null;
  onVote: (voteType: 'upvote' | 'downvote') => void;
  isLoading?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export const PostVoting: React.FC<PostVotingProps> = ({
  upvotes,
  downvotes,
  totalVotes,
  userVote,
  onVote,
  isLoading = false,
  direction = 'vertical',
}) => {
  if (direction === 'horizontal') {
    return (
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => onVote('upvote')}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
            userVote === 'upvote'
              ? 'bg-green-100 text-green-600'
              : 'text-gray-600 hover:bg-gray-100'
          } disabled:opacity-50`}
        >
          <span>▲</span>
          <span className="text-sm font-medium">{upvotes}</span>
        </button>

        <div className="w-1 h-6 bg-gray-300 rounded" />

        <button
          onClick={() => onVote('downvote')}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
            userVote === 'downvote'
              ? 'bg-red-100 text-red-600'
              : 'text-gray-600 hover:bg-gray-100'
          } disabled:opacity-50`}
        >
          <span>▼</span>
          <span className="text-sm font-medium">{downvotes}</span>
        </button>

        <div className="ml-auto text-center">
          <p className="text-xs text-gray-500">Total Votes</p>
          <p className="text-lg font-bold text-gray-900">{totalVotes}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => onVote('upvote')}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors ${
          userVote === 'upvote'
            ? 'bg-green-100 text-green-600'
            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
        } disabled:opacity-50`}
      >
        ▲
      </button>

      <div className="text-center">
        <p className="text-lg font-bold text-gray-900">{totalVotes}</p>
        <p className="text-xs text-gray-500">votes</p>
      </div>

      <button
        onClick={() => onVote('downvote')}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors ${
          userVote === 'downvote'
            ? 'bg-red-100 text-red-600'
            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
        } disabled:opacity-50`}
      >
        ▼
      </button>
    </div>
  );
};
