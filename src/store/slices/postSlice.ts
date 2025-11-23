/**
 * Post Redux Slice
 * Manages post state including list, current post, and voting
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '@/types/community.types';

export interface PostState {
  // Post list
  posts: Post[];
  totalPosts: number;
  isLoadingPosts: boolean;

  // Current post
  currentPost: Post | null;
  isLoadingCurrent: boolean;

  // UI state
  selectedTypeFilter: string | null;
  sortBy: 'recent' | 'popular' | 'mostViewed';
  currentPage: number;
  pageSize: number;

  // Voting state
  userVotes: Record<string, 'upvote' | 'downvote'>; // postId -> vote type

  // Error handling
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  totalPosts: 0,
  isLoadingPosts: false,
  currentPost: null,
  isLoadingCurrent: false,
  selectedTypeFilter: null,
  sortBy: 'recent',
  currentPage: 1,
  pageSize: 15,
  userVotes: {},
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // Loading states
    setLoadingPosts: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPosts = action.payload;
    },
    setLoadingCurrent: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCurrent = action.payload;
    },

    // Post list actions
    setPosts: (
      state,
      action: PayloadAction<{ posts: Post[]; total: number }>
    ) => {
      state.posts = action.payload.posts;
      state.totalPosts = action.payload.total;
      state.error = null;
    },

    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
      state.totalPosts += 1;
    },

    updatePostInList: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },

    removePostFromList: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
      state.totalPosts = Math.max(0, state.totalPosts - 1);
    },

    // Current post actions
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
      state.error = null;
    },

    updateCurrentPost: (state, action: PayloadAction<Partial<Post>>) => {
      if (state.currentPost) {
        state.currentPost = { ...state.currentPost, ...action.payload };
      }
    },

    // Voting
    setUserVote: (
      state,
      action: PayloadAction<{ postId: string; voteType: 'upvote' | 'downvote' | null }>
    ) => {
      if (action.payload.voteType === null) {
        delete state.userVotes[action.payload.postId];
      } else {
        state.userVotes[action.payload.postId] = action.payload.voteType;
      }
    },

    updatePostVotes: (
      state,
      action: PayloadAction<{
        postId: string;
        upvotes: number;
        downvotes: number;
        totalVotes: number;
      }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.postId);
      if (post) {
        post.votes = {
          upvotes: action.payload.upvotes,
          downvotes: action.payload.downvotes,
          totalVotes: action.payload.totalVotes,
        };
      }

      if (state.currentPost?.id === action.payload.postId) {
        state.currentPost.votes = {
          upvotes: action.payload.upvotes,
          downvotes: action.payload.downvotes,
          totalVotes: action.payload.totalVotes,
        };
      }
    },

    // Filter and sort
    setTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedTypeFilter = action.payload;
      state.currentPage = 1;
    },

    setSortBy: (
      state,
      action: PayloadAction<'recent' | 'popular' | 'mostViewed'>
    ) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload);
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = Math.max(10, Math.min(50, action.payload));
      state.currentPage = 1;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearFilters: (state) => {
      state.selectedTypeFilter = null;
      state.sortBy = 'recent';
      state.currentPage = 1;
    },

    resetPostState: () => initialState,
  },
});

export const {
  setLoadingPosts,
  setLoadingCurrent,
  setPosts,
  addPost,
  updatePostInList,
  removePostFromList,
  setCurrentPost,
  updateCurrentPost,
  setUserVote,
  updatePostVotes,
  setTypeFilter,
  setSortBy,
  setCurrentPage,
  setPageSize,
  setError,
  clearFilters,
  resetPostState,
} = postSlice.actions;

export default postSlice.reducer;
