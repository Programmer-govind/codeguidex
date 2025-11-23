'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PostService } from '@/services/post.service';
import { CommunityService } from '@/services/community.service';
import CommentService, { type Comment } from '@/services/comment.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Badge } from '@/components/common/Badge';
import type { Post, Community } from '@/types/community.types';

interface PostDetailPageProps {
  params: {
    id: string;
    postId: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commenting, setCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch post and community data in parallel
        const [postData, communityData] = await Promise.all([
          PostService.getPost(params.id, params.postId),
          CommunityService.getCommunity(params.id)
        ]);

        setPost(postData);
        setCommunity(communityData);

        // Set user's current vote if exists
        if (user && postData.userVotes) {
          setUserVote(postData.userVotes[user.id] || null);
        }

        // Record view
        if (user) {
          PostService.recordPostView(params.id, params.postId, user.id).catch(console.error);
        }

        // Fetch comments
        await fetchComments();
      } catch (err) {
        console.error('Failed to fetch post details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.postId, user]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { comments: fetchedComments } = await CommentService.getComments(params.id, params.postId, 50);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user || !post) {
      alert('Please log in to vote');
      return;
    }

    try {
      await PostService.votePost(params.id, params.postId, user.id, voteType);

      // Refetch post to get updated vote counts from server
      const updatedPost = await PostService.getPost(params.id, params.postId);
      setPost(updatedPost);

      // Update user vote state
      if (updatedPost.userVotes) {
        setUserVote(updatedPost.userVotes[user.id] || null);
      }
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleComment = async () => {
    if (!user || !commentText.trim()) return;

    setCommenting(true);
    try {
      const newComment = await CommentService.createComment(params.id, params.postId, {
        content: commentText,
        authorId: user.id,
        authorName: user.displayName || 'Anonymous',
        authorProfilePicture: user.profilePicture,
      });

      // Add comment to local state
      setComments(prev => [newComment, ...prev]);

      // Update post comment count
      setPost(prev => prev ? { ...prev, comments: { ...prev.comments, count: (prev.comments.count || 0) + 1 } } : prev);

      // Clear input
      setCommentText('');
    } catch (err) {
      console.error('Failed to comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !user) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await PostService.deletePost(params.id, params.postId, user.id);
      router.push(`/communities/${params.id}`);
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading post..." />;
  }

  if (error || !post || !community) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error || 'Post not found'} type="error" />
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push('/communities')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Communities
          </button>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => router.push(`/communities/${params.id}`)}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {community.name}
          </button>
        </nav>

        {/* Post Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge label={post.type} variant="primary" size="sm" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} label={tag} variant="secondary" size="sm" />
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
              </div>

              {isAuthor && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/communities/${params.id}/posts/${params.postId}/edit`)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Author & Date */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {post.authorName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {post.authorName || 'Unknown Author'}
                </span>
              </div>
              <span>•</span>
              <time>{formatDate(post.createdAt)}</time>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-gray-500 dark:text-gray-500">
                    Updated {formatDate(post.updatedAt)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.codeSnippet && (
                <div className="mt-6 bg-gray-900 dark:bg-gray-950 rounded-xl p-6 overflow-x-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 font-mono">
                      {post.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="text-sm text-gray-100 font-mono">
                    <code>{post.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userVote === 'upvote'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="font-medium">{post.votes.upvotes || 0}</span>
                </button>
                <button
                  onClick={() => handleVote('downvote')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${userVote === 'downvote'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                  <span className="font-medium">{post.votes.downvotes || 0}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{comments.length} comments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Input */}
          {user ? (
            <div className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {commentText.length}/1000 characters
                </span>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || commenting || commentText.length > 1000}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {commenting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Please <button onClick={() => router.push('/auth/login')} className="text-blue-600 hover:underline">log in</button> to comment
              </p>
            </div>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center py-12">
              <LoadingSpinner message="Loading comments..." />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.authorName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.authorName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) || 'Just now'}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {comment.codeSnippet && (
                      <div className="mt-3 bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100 font-mono">
                          <code>{comment.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {comment.votes?.upvotes || 0}
                      </button>
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        {comment.votes?.downvotes || 0}
                      </button>
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}