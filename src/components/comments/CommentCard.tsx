'use client';

import { useState } from 'react';
import { Comment } from '@services/comment.service';
import { formatDistanceToNow } from 'date-fns';
import CommentVoting from '@components/comments/CommentVoting';
import CommentActions from '@components/comments/CommentActions';
import ReplyForm from '@components/comments/ReplyForm';

interface CommentCardProps {
  comment: Comment;
  currentUserId: string;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onReply?: (parentCommentId: string, content: string) => Promise<void>;
  onLoadReplies?: (commentId: string) => Promise<void>;
  replies?: Comment[];
  repliesLoading?: boolean;
  showReplies?: boolean;
  onToggleReplies?: (commentId: string) => void;
}

export default function CommentCard({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  onLoadReplies,
  replies = [],
  repliesLoading = false,
  showReplies = false,
  onToggleReplies,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor = currentUserId === comment.authorId;
  const createdAt = comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date();

  const handleEditSubmit = async () => {
    if (editContent.trim() && onEdit) {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleReplySubmit = async (content: string) => {
    if (onReply) {
      await onReply(comment.id, content);
      setIsReplying(false);
    }
  };

  const handleToggleReplies = async () => {
    if (onToggleReplies) {
      onToggleReplies(comment.id);
    }
    if (!showReplies && onLoadReplies && replies.length === 0) {
      await onLoadReplies(comment.id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white hover:shadow-sm transition">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {comment.authorProfilePicture && (
            <img
              src={comment.authorProfilePicture}
              alt={comment.authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{comment.authorName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
              {comment.isEdited && ' (edited)'}
            </p>
          </div>
        </div>

        {isAuthor && (
          <CommentActions
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete?.(comment.id)}
          />
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            rows={3}
            maxLength={5000}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditSubmit}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 text-gray-700 whitespace-pre-wrap break-words">
          {comment.content}
        </div>
      )}

      {/* Code Snippet */}
      {comment.codeSnippet && (
        <div className="mb-3 bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
          <div className="text-xs text-gray-400 mb-2">{comment.codeSnippet.language}</div>
          <code>{comment.codeSnippet.code}</code>
        </div>
      )}

      {/* Voting & Actions */}
      <div className="flex items-center justify-between">
        <CommentVoting
          commentId={comment.id}
          votes={comment.votes}
          userVotes={comment.userVotes}
          currentUserId={currentUserId}
        />

        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isReplying ? 'Cancel' : 'Reply'}
        </button>

        {comment.replyCount > 0 && (
          <button
            onClick={handleToggleReplies}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            {showReplies ? '▼' : '▶'} {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {/* Replies List */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-300 space-y-3">
          {repliesLoading ? (
            <div className="text-sm text-gray-500">Loading replies...</div>
          ) : (
            replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
