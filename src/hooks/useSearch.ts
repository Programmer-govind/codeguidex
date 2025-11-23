import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  performSearchAsync,
  getSuggestionsAsync,
  trackSearchAsync,
  setCurrentQuery,
  setSearchType,
  setSortBy,
  clearSearch,
  clearError,
} from '@store/slices/searchSlice';
import { SearchQuery, SearchFilters, SearchResult } from '@services/search.service';

/**
 * Custom hook for search functionality
 * Handles search, suggestions, and tracking
 */
export function useSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.search);
  const auth = useAppSelector((state) => state.auth);

  /**
   * Perform search with given parameters
   */
  const performSearch = useCallback(
    async (searchTerm: string, filters?: SearchFilters) => {
      if (!searchTerm || searchTerm.trim().length === 0) {
        dispatch(clearSearch());
        return;
      }

      const searchQuery: SearchQuery = {
        searchTerm: searchTerm.trim(),
        type: search.searchType,
        filters,
        sortBy: search.sortBy,
      };

      const resultAction = await dispatch(performSearchAsync(searchQuery));

      // Track search if user is authenticated
      if (auth.user?.id && resultAction.payload) {
        void dispatch(
          trackSearchAsync({
            userId: auth.user.id,
            searchTerm: searchTerm.trim(),
            resultsCount: (resultAction.payload as SearchResult[]).length,
          })
        );
      }

      return resultAction.payload;
    },
    [dispatch, search.searchType, search.sortBy, auth.user?.id]
  );

  /**
   * Get search suggestions for autocomplete
   */
  const getSuggestions = useCallback(
    async (partialTerm: string) => {
      if (!partialTerm || partialTerm.trim().length < 2) {
        return [];
      }

      const resultAction = await dispatch(
        getSuggestionsAsync({
          term: partialTerm.trim(),
          type: search.searchType === 'all' ? undefined : search.searchType,
        })
      );

      return resultAction.payload || [];
    },
    [dispatch, search.searchType]
  );

  /**
   * Update search type filter
   */
  const updateSearchType = useCallback(
    (type: 'all' | 'post' | 'community' | 'user') => {
      dispatch(setSearchType(type));
    },
    [dispatch]
  );

  /**
   * Update sort order
   */
  const updateSortBy = useCallback(
    (sortBy: 'relevance' | 'newest' | 'popular') => {
      dispatch(setSortBy(sortBy));
    },
    [dispatch]
  );

  /**
   * Clear all search results
   */
  const clear = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  /**
   * Clear error message
   */
  const clearSearchError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Update current search query
   */
  const updateQuery = useCallback(
    (query: string) => {
      dispatch(setCurrentQuery(query));
    },
    [dispatch]
  );

  return {
    // State
    results: search.results,
    suggestions: search.suggestions,
    currentQuery: search.currentQuery,
    searchType: search.searchType,
    sortBy: search.sortBy,
    loading: search.loading,
    error: search.error,
    totalResults: search.totalResults,

    // Actions
    performSearch,
    getSuggestions,
    updateSearchType,
    updateSortBy,
    clear,
    clearSearchError,
    updateQuery,
  };
}
