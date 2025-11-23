import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchService, SearchResult, SearchQuery } from '@services/search.service';

/**
 * Search state interface
 */
export interface SearchState {
  results: SearchResult[];
  suggestions: string[];
  currentQuery: string;
  searchType: 'all' | 'post' | 'community' | 'user';
  sortBy: 'relevance' | 'newest' | 'popular';
  loading: boolean;
  error: string | null;
  totalResults: number;
}

/**
 * Initial search state
 */
const initialState: SearchState = {
  results: [],
  suggestions: [],
  currentQuery: '',
  searchType: 'all',
  sortBy: 'relevance',
  loading: false,
  error: null,
  totalResults: 0,
};

/**
 * Async thunk for performing search
 */
export const performSearchAsync = createAsyncThunk(
  'search/performSearch',
  async (searchQuery: SearchQuery) => {
    const results = await SearchService.search(searchQuery);
    return results;
  }
);

/**
 * Async thunk for getting suggestions
 */
export const getSuggestionsAsync = createAsyncThunk(
  'search/getSuggestions',
  async ({ term, type }: { term: string; type?: 'post' | 'community' | 'user' }) => {
    const suggestions = await SearchService.getSuggestions(term, type);
    return suggestions;
  }
);

/**
 * Async thunk for tracking search
 */
export const trackSearchAsync = createAsyncThunk(
  'search/trackSearch',
  async ({ userId, searchTerm, resultsCount }: { userId: string; searchTerm: string; resultsCount: number }) => {
    await SearchService.trackSearch(userId, searchTerm, resultsCount);
    return true;
  }
);

/**
 * Search slice - manages search state
 */
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * Set current search query
     */
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },

    /**
     * Set search type filter
     */
    setSearchType: (state, action: PayloadAction<'all' | 'post' | 'community' | 'user'>) => {
      state.searchType = action.payload;
    },

    /**
     * Set sort order
     */
    setSortBy: (state, action: PayloadAction<'relevance' | 'newest' | 'popular'>) => {
      state.sortBy = action.payload;
    },

    /**
     * Clear search results
     */
    clearSearch: (state) => {
      state.results = [];
      state.suggestions = [];
      state.currentQuery = '';
      state.error = null;
      state.totalResults = 0;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle performSearchAsync
    builder
      .addCase(performSearchAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.totalResults = action.payload.length;
        state.error = null;
      })
      .addCase(performSearchAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
        state.results = [];
        state.totalResults = 0;
      });

    // Handle getSuggestionsAsync
    builder
      .addCase(getSuggestionsAsync.pending, () => {
        // Can optionally set loading state for suggestions
      })
      .addCase(getSuggestionsAsync.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(getSuggestionsAsync.rejected, (state, action) => {
        console.error('Error getting suggestions:', action.error);
        state.suggestions = [];
      });

    // Handle trackSearchAsync
    builder
      .addCase(trackSearchAsync.fulfilled, () => {
        // Search tracking completed successfully
      })
      .addCase(trackSearchAsync.rejected, (_state, action) => {
        console.error('Error tracking search:', action.error);
      });
  },
});

/**
 * Export actions
 */
export const { setCurrentQuery, setSearchType, setSortBy, clearSearch, clearError } = searchSlice.actions;

/**
 * Export reducer
 */
export default searchSlice.reducer;
