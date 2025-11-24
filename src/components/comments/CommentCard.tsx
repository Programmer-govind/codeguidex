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
    <div className="glass-card p-6 mb-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {comment.authorProfilePicture && (
            <img
              src={comment.authorProfilePicture}
              alt={comment.authorName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 shadow-md"
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
        <div className="mb-4 space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="input-field min-h-[100px] resize-y"
            rows={3}
            maxLength={5000}
            placeholder="Edit your comment..."
          />
          <div className="flex gap-3">
            <button
              onClick={handleEditSubmit}
              className="btn-primary px-6 py-2 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="btn-secondary px-6 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
          {comment.content}
        </div>
      )}

      {/* Code Snippet */}
      {comment.codeSnippet && (
        <div className="mb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-5 rounded-xl text-sm font-mono overflow-x-auto shadow-lg border border-gray-700/50">
          <div className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {comment.codeSnippet.language}
          </div>
          <code className="text-emerald-400">{comment.codeSnippet.code}</code>
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
          className="btn-outline px-4 py-2 text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          {isReplying ? 'Cancel' : 'Reply'}
        </button>

        {comment.replyCount > 0 && (
          <button
            onClick={handleToggleReplies}
            className="btn-outline px-4 py-2 text-sm flex items-center gap-2"
          >
            <svg className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="font-semibold">{comment.replyCount}</span> {comment.replyCount === 1 ? 'reply' : 'replies'}
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
