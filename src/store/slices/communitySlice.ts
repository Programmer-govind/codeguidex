/**
 * Community Redux Slice
 * Manages community state including list, current community, and membership
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Community } from '@/types/community.types';

export interface CommunityState {
  // Community list
  communities: Community[];
  totalCommunities: number;
  isLoadingCommunities: boolean;

  // Current community
  currentCommunity: Community | null;
  isLoadingCurrent: boolean;

  // UI state
  selectedCategoryFilter: string | null;
  selectedVisibilityFilter: 'public' | 'private' | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;

  // Error handling
  error: string | null;
}

const initialState: CommunityState = {
  communities: [],
  totalCommunities: 0,
  isLoadingCommunities: false,
  currentCommunity: null,
  isLoadingCurrent: false,
  selectedCategoryFilter: null,
  selectedVisibilityFilter: null,
  searchTerm: '',
  currentPage: 1,
  pageSize: 20,
  error: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    // Loading states
    setLoadingCommunities: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCommunities = action.payload;
    },
    setLoadingCurrent: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCurrent = action.payload;
    },

    // Community list actions
    setCommunities: (
      state,
      action: PayloadAction<{ communities: Community[]; total: number }>
    ) => {
      state.communities = action.payload.communities;
      state.totalCommunities = action.payload.total;
      state.error = null;
    },

    addCommunity: (state, action: PayloadAction<Community>) => {
      state.communities.unshift(action.payload);
      state.totalCommunities += 1;
    },

    updateCommunityInList: (state, action: PayloadAction<Community>) => {
      const index = state.communities.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.communities[index] = action.payload;
      }
    },

    removeCommunityFromList: (state, action: PayloadAction<string>) => {
      state.communities = state.communities.filter((c) => c.id !== action.payload);
      state.totalCommunities = Math.max(0, state.totalCommunities - 1);
    },

    // Current community actions
    setCurrentCommunity: (state, action: PayloadAction<Community | null>) => {
      state.currentCommunity = action.payload;
      state.error = null;
    },

    updateCurrentCommunity: (state, action: PayloadAction<Partial<Community>>) => {
      if (state.currentCommunity) {
        state.currentCommunity = { ...state.currentCommunity, ...action.payload };
      }
    },

    // Filter and search actions
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryFilter = action.payload;
      state.currentPage = 1; // Reset to first page
    },

    setVisibilityFilter: (
      state,
      action: PayloadAction<'public' | 'private' | null>
    ) => {
      state.selectedVisibilityFilter = action.payload;
      state.currentPage = 1;
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = Math.max(1, action.payload);
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = Math.max(10, Math.min(100, action.payload));
      state.currentPage = 1;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearFilters: (state) => {
      state.selectedCategoryFilter = null;
      state.selectedVisibilityFilter = null;
      state.searchTerm = '';
      state.currentPage = 1;
    },

    resetCommunityState: () => initialState,
  },
});

export const {
  setLoadingCommunities,
  setLoadingCurrent,
  setCommunities,
  addCommunity,
  updateCommunityInList,
  removeCommunityFromList,
  setCurrentCommunity,
  updateCurrentCommunity,
  setCategoryFilter,
  setVisibilityFilter,
  setSearchTerm,
  setCurrentPage,
  setPageSize,
  setError,
  clearFilters,
  resetCommunityState,
} = communitySlice.actions;

export default communitySlice.reducer;
