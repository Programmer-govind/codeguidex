'use client';

import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  currentUserName?: string;
  currentUserAvatar?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = 'Share your thoughts...',
  isLoading = false,
  currentUserName = 'You',
  currentUserAvatar,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 5000) {
      setError('Comment is too long (maximum 5000 characters)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(content);
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-4 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {currentUserAvatar && (
          <img
            src={currentUserAvatar}
            alt={currentUserName}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-medium text-gray-900">{currentUserName}</p>
          <p className="text-xs text-gray-500">Comment as {currentUserName}</p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={5000}
        disabled={isSubmitting || isLoading}
        className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none"
        rows={4}
      />

      {/* Character count */}
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {content.length}/5000 characters
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex gap-2 justify-end">
        <button
          onClick={() => {
            setContent('');
            setError(null);
          }}
          disabled={isSubmitting || isLoading || !content.trim()}
          className="btn-secondary"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading || !content.trim()}
          className="btn-primary"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </div>
  );
}
