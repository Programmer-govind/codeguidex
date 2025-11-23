import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  fetchComments,
  fetchReplies,
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  removeCommentVote,
  clearComments,
} from '@store/slices/commentSlice';
import { CreateCommentInput, UpdateCommentInput } from '@services/comment.service';

export const useComments = (communityId: string, postId: string) => {
  const dispatch = useAppDispatch();
  const {
    comments,
    replies,
    loading,
    error,
    pagination,
  } = useAppSelector((state) => state.comments);

  /**
   * Fetch comments for the post
   */
  const loadComments = useCallback(
    async (pageSize?: number) => {
      return dispatch(
        fetchComments({
          communityId,
          postId,
          pageSize,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Load next page of comments
   */
  const loadMoreComments = useCallback(
    async (pageSize?: number) => {
      return dispatch(
        fetchComments({
          communityId,
          postId,
          pageSize,
          startAfterDoc: pagination.lastDoc,
        })
      );
    },
    [dispatch, communityId, postId, pagination.lastDoc]
  );

  /**
   * Load replies for a specific comment
   */
  const loadReplies = useCallback(
    async (parentCommentId: string) => {
      return dispatch(
        fetchReplies({
          communityId,
          postId,
          parentCommentId,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Create a new comment or reply
   */
  const addComment = useCallback(
    async (commentData: CreateCommentInput) => {
      return dispatch(
        createComment({
          communityId,
          postId,
          commentData,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Edit an existing comment
   */
  const editComment = useCallback(
    async (commentId: string, updates: UpdateCommentInput) => {
      return dispatch(
        updateComment({
          communityId,
          postId,
          commentId,
          updates,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Delete a comment
   */
  const removeComment = useCallback(
    async (commentId: string, parentCommentId?: string) => {
      return dispatch(
        deleteComment({
          communityId,
          postId,
          commentId,
          parentCommentId,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Upvote a comment
   */
  const upvote = useCallback(
    async (commentId: string, userId: string) => {
      return dispatch(
        upvoteComment({
          communityId,
          postId,
          commentId,
          userId,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Downvote a comment
   */
  const downvote = useCallback(
    async (commentId: string, userId: string) => {
      return dispatch(
        downvoteComment({
          communityId,
          postId,
          commentId,
          userId,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Remove a vote from a comment
   */
  const unvote = useCallback(
    async (commentId: string, userId: string) => {
      return dispatch(
        removeCommentVote({
          communityId,
          postId,
          commentId,
          userId,
        })
      );
    },
    [dispatch, communityId, postId]
  );

  /**
   * Clear all comments
   */
  const clear = useCallback(() => {
    dispatch(clearComments());
  }, [dispatch]);

  return {
    // State
    comments,
    replies,
    loading,
    error,
    pagination,

    // Methods
    loadComments,
    loadMoreComments,
    loadReplies,
    addComment,
    editComment,
    removeComment,
    upvote,
    downvote,
    unvote,
    clear,
  };
};
