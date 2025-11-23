'use client';

import { SearchResult } from '@services/search.service';
import { SearchResultCard } from '@components/search/SearchResultCard';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  onResultClick?: (result: SearchResult) => void;
}

/**
 * SearchResults Component - Display search results with type-specific formatting
 */
export function SearchResults({ results, loading, error, totalResults, onResultClick }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
        <p className="font-semibold">Search Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="mt-4 text-gray-600 dark:text-gray-400">No results found</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try different keywords or filters</p>
      </div>
    );
  }

  // Group results by type
  const resultsByType = {
    post: results.filter((r) => r.type === 'post'),
    community: results.filter((r) => r.type === 'community'),
    user: results.filter((r) => r.type === 'user'),
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Found <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> results
      </div>

      {/* Posts Results */}
      {resultsByType.post.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-blue-500 rounded mr-3" />
            Posts ({resultsByType.post.length})
          </h3>
          <div className="space-y-3">
            {resultsByType.post.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onClick={() => onResultClick?.(result)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Communities Results */}
      {resultsByType.community.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-green-500 rounded mr-3" />
            Communities ({resultsByType.community.length})
          </h3>
          <div className="space-y-3">
            {resultsByType.community.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onClick={() => onResultClick?.(result)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Users Results */}
      {resultsByType.user.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 rounded mr-3" />
            Users ({resultsByType.user.length})
          </h3>
          <div className="space-y-3">
            {resultsByType.user.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                onClick={() => onResultClick?.(result)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
