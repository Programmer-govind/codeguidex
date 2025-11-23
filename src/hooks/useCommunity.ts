/**
 * Custom Hooks for Community Feature
 * Provides easy access to community operations with Redux integration
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import type { CreateCommunityRequest, UpdateCommunityRequest } from '@/types/community.types';
import { CommunityService } from '@/services/community.service';
import {
  setLoadingCommunities,
  setLoadingCurrent,
  setCommunities,
  setCurrentCommunity,
  updateCurrentCommunity,
  setError,
  setCategoryFilter,
  setVisibilityFilter,
  setSearchTerm,
  setCurrentPage,
} from '@/store/slices/communitySlice';

/**
 * Hook to fetch all communities with filtering and pagination
 */
export const useFetchCommunities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    communities,
    totalCommunities,
    isLoadingCommunities,
    selectedCategoryFilter,
    selectedVisibilityFilter,
    searchTerm,
    currentPage,
    pageSize,
    error,
  } = useSelector((state: RootState) => state.community);

  const fetchCommunities = useCallback(async () => {
    dispatch(setLoadingCommunities(true));
    try {
      const result = await CommunityService.getAllCommunities({
        category: selectedCategoryFilter || undefined,
        visibility: selectedVisibilityFilter || undefined,
        searchTerm: searchTerm || undefined,
        page: currentPage,
        pageSize: pageSize,
      });

      dispatch(setCommunities(result));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch communities';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoadingCommunities(false));
    }
  }, [dispatch, selectedCategoryFilter, selectedVisibilityFilter, searchTerm, currentPage, pageSize]);

  return {
    communities,
    totalCommunities,
    isLoading: isLoadingCommunities,
    error,
    fetchCommunities,
  };
};

/**
 * Hook to fetch a single community
 */
export const useFetchCommunity = (communityId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCommunity, isLoadingCurrent, error } = useSelector(
    (state: RootState) => state.community
  );

  const fetchCommunity = useCallback(async () => {
    if (!communityId) return;

    dispatch(setLoadingCurrent(true));
    try {
      const community = await CommunityService.getCommunity(communityId);
      dispatch(setCurrentCommunity(community));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch community';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoadingCurrent(false));
    }
  }, [dispatch, communityId]);

  return {
    community: currentCommunity,
    isLoading: isLoadingCurrent,
    error,
    fetchCommunity,
  };
};

/**
 * Hook to create a new community
 */
export const useCreateCommunity = () => {
  const dispatch = useDispatch<AppDispatch>();

  const createCommunity = useCallback(
    async (createData: CreateCommunityRequest, userId: string, userName: string) => {
      dispatch(setLoadingCurrent(true));
      try {
        const newCommunityId = await CommunityService.createCommunity(
          createData,
          userId,
          userName
        );

        // Fetch the created community
        const newCommunity = await CommunityService.getCommunity(newCommunityId);
        dispatch(setCurrentCommunity(newCommunity));

        return newCommunityId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create community';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoadingCurrent(false));
      }
    },
    [dispatch]
  );

  return { createCommunity };
};

/**
 * Hook to update a community
 */
export const useUpdateCommunity = () => {
  const dispatch = useDispatch<AppDispatch>();

  const updateCommunity = useCallback(
    async (
      communityId: string,
      updateData: UpdateCommunityRequest,
      userId: string
    ) => {
      try {
        await CommunityService.updateCommunity(communityId, updateData, userId);

        // Fetch updated community
        const updatedCommunity = await CommunityService.getCommunity(communityId);
        dispatch(setCurrentCommunity(updatedCommunity));

        return updatedCommunity;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update community';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { updateCommunity };
};

/**
 * Hook for community filtering and search
 */
export const useCommunityFilters = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setCategoryFilterAction = useCallback(
    (category: string | null) => {
      dispatch(setCategoryFilter(category));
    },
    [dispatch]
  );

  const setVisibilityFilterAction = useCallback(
    (visibility: 'public' | 'private' | null) => {
      dispatch(setVisibilityFilter(visibility));
    },
    [dispatch]
  );

  const setSearchTermAction = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
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
    setCategoryFilter: setCategoryFilterAction,
    setVisibilityFilter: setVisibilityFilterAction,
    setSearchTerm: setSearchTermAction,
    goToPage,
  };
};

/**
 * Hook to join/leave a community
 */
export const useCommunityMembership = () => {
  const dispatch = useDispatch<AppDispatch>();

  const joinCommunity = useCallback(
    async (userId: string, communityId: string) => {
      try {
        await CommunityService.joinCommunity(userId, communityId);

        // Fetch updated community
        const updatedCommunity = await CommunityService.getCommunity(communityId);
        dispatch(updateCurrentCommunity(updatedCommunity));

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join community';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  const leaveCommunity = useCallback(
    async (userId: string, communityId: string) => {
      try {
        await CommunityService.leaveCommunity(userId, communityId);

        // Fetch updated community
        const updatedCommunity = await CommunityService.getCommunity(communityId);
        dispatch(updateCurrentCommunity(updatedCommunity));

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to leave community';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { joinCommunity, leaveCommunity };
};

/**
 * Hook to get community members
 */
export const useCommunityMembers = (communityId: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchMembers = useCallback(async () => {
    if (!communityId) return [];

    try {
      const members = await CommunityService.getCommunityMembers(communityId);
      return members;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch, communityId]);

  return { fetchMembers };
};
