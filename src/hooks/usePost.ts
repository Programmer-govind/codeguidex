/**
 * Custom Hooks for Post Feature
 * Provides easy access to post operations with Redux integration
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import type { CreatePostRequest, UpdatePostRequest } from '@/types/community.types';
import { PostService } from '@/services/post.service';
import {
  setLoadingPosts,
  setLoadingCurrent,
  setPosts,
  setCurrentPost,
  updateCurrentPost,
  setUserVote,
  setError,
  setTypeFilter,
  setSortBy,
  setCurrentPage,
} from '@/store/slices/postSlice';

/**
 * Hook to fetch posts in a community
 */
export const useFetchPosts = (communityId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    posts,
    totalPosts,
    isLoadingPosts,
    selectedTypeFilter,
    sortBy,
    currentPage,
    pageSize,
    error,
  } = useSelector((state: RootState) => state.post);

  const fetchPosts = useCallback(async () => {
    if (!communityId) return;

    dispatch(setLoadingPosts(true));
    try {
      const result = await PostService.getCommunityPosts(communityId, {
        type: selectedTypeFilter || undefined,
        sortBy: sortBy,
        page: currentPage,
        pageSize: pageSize,
      });

      dispatch(setPosts(result));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoadingPosts(false));
    }
  }, [dispatch, communityId, selectedTypeFilter, sortBy, currentPage, pageSize]);

  return {
    posts,
    totalPosts,
    isLoading: isLoadingPosts,
    error,
    fetchPosts,
  };
};

/**
 * Hook to fetch a single post
 */
export const useFetchPost = (communityId: string | null, postId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPost, isLoadingCurrent, error } = useSelector(
    (state: RootState) => state.post
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchPost = useCallback(async () => {
    if (!communityId || !postId) return;

    dispatch(setLoadingCurrent(true));
    try {
      const post = await PostService.getPost(communityId, postId);
      dispatch(setCurrentPost(post));

      // Record view
      if (user?.id) {
        await PostService.recordPostView(communityId, postId, user.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoadingCurrent(false));
    }
  }, [dispatch, communityId, postId, user?.id]);

  return {
    post: currentPost,
    isLoading: isLoadingCurrent,
    error,
    fetchPost,
  };
};

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingCurrent, error } = useSelector(
    (state: RootState) => state.post
  );

  const createPost = useCallback(
    async (
      communityId: string,
      createData: CreatePostRequest,
      userId: string,
      authorName: string
    ) => {
      dispatch(setLoadingCurrent(true));
      try {
        const newPostId = await PostService.createPost(
          communityId,
          createData,
          userId,
          authorName
        );

        // Fetch the created post
        const newPost = await PostService.getPost(communityId, newPostId);
        dispatch(setCurrentPost(newPost));

        return newPostId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoadingCurrent(false));
      }
    },
    [dispatch]
  );

  return {
    createPost,
    isCreating: isLoadingCurrent,
    error
  };
};

/**
 * Hook to update a post
 */
export const useUpdatePost = () => {
  const dispatch = useDispatch<AppDispatch>();

  const updatePost = useCallback(
    async (
      communityId: string,
      postId: string,
      updateData: UpdatePostRequest,
      userId: string
    ) => {
      try {
        await PostService.updatePost(communityId, postId, updateData, userId);

        // Fetch updated post
        const updatedPost = await PostService.getPost(communityId, postId);
        dispatch(updateCurrentPost(updatedPost));

        return updatedPost;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { updatePost };
};

/**
 * Hook for voting on posts
 */
export const usePostVoting = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userVotes = useSelector((state: RootState) => state.post.userVotes);

  const votePost = useCallback(
    async (
      communityId: string,
      postId: string,
      userId: string,
      voteType: 'upvote' | 'downvote'
    ) => {
      try {
        // Get current vote state
        const currentVote = userVotes[postId];

        // Determine actual vote type to send
        let finalVoteType: 'upvote' | 'downvote' | null = voteType;
        if (currentVote === voteType) {
          finalVoteType = null; // Remove vote
        }

        // Send vote to service
        await PostService.votePost(
          communityId,
          postId,
          userId,
          voteType
        );

        // Update Redux state
        dispatch(setUserVote({ postId, voteType: finalVoteType }));

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to vote on post';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch, userVotes]
  );

  const getUserVote = useCallback(
    (postId: string) => {
      return userVotes[postId] || null;
    },
    [userVotes]
  );

  return { votePost, getUserVote };
};

/**
 * Hook for post filtering and sorting
 */
export const usePostFilters = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setTypeFilterAction = useCallback(
    (type: string | null) => {
      dispatch(setTypeFilter(type));
    },
    [dispatch]
  );

  const setSortByAction = useCallback(
    (sort: 'recent' | 'popular' | 'mostViewed') => {
      dispatch(setSortBy(sort));
    },
    [dispatch]
  );

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  return {
    setTypeFilter: setTypeFilterAction,
    setSortBy: setSortByAction,
    goToPage,
  };
};

/**
 * Hook to report a post
 */
export const useReportPost = () => {
  const dispatch = useDispatch<AppDispatch>();

  const reportPost = useCallback(
    async (communityId: string, postId: string) => {
      try {
        await PostService.reportPostAsSpam(communityId, postId);
        dispatch(setError(null));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to report post';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { reportPost };
};
