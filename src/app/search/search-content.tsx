'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearch } from '@hooks/useSearch';
import { SearchResults } from '@components/search/SearchResults';
import { SearchBar } from '@components/search/SearchBar';
import { AdvancedFilters } from '@components/search/AdvancedFilters';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import Header from '@components/common/Header';
import { SearchFilters } from '@services/search.service';

/**
 * Search Page Content Component
 * Contains all search logic wrapped in Suspense boundary
 */
export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    performSearch,
    updateSearchType,
    updateSortBy,
    results,
    loading,
    error,
  } = useSearch();

  const initialSearchTerm = searchParams?.get('q') || '';
  const initialSearchType = (searchParams?.get('type') as 'post' | 'community' | 'user') || 'post';
  const initialSortBy = (searchParams?.get('sort') as 'relevance' | 'newest' | 'popular') || 'relevance';

  useEffect(() => {
    if (initialSearchTerm) {
      updateSearchType(initialSearchType);
      updateSortBy(initialSortBy);
      void performSearch(initialSearchTerm);
    }
  }, [initialSearchTerm, initialSearchType, initialSortBy, performSearch, updateSearchType, updateSortBy]);

  const handleSearchChange = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${initialSearchType}&sort=${initialSortBy}`);
    }
  };

  const handleFiltersApply = (filters: SearchFilters) => {
    if (initialSearchTerm) {
      void performSearch(initialSearchTerm, filters);
    }
    setMobileFiltersOpen(false);
  };

  const handleTypeChange = (type: 'post' | 'community' | 'user') => {
    updateSearchType(type);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('type', type);
    router.push(newUrl.pathname + newUrl.search);
  };

  const handleSortChange = (sort: 'relevance' | 'newest' | 'popular') => {
    updateSortBy(sort);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('sort', sort);
    router.push(newUrl.pathname + newUrl.search);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header showSearch={true} showNotifications={true} showUserMenu={true} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {initialSearchTerm ? `Search Results for "${initialSearchTerm}"` : 'Search CodeGuideX'}
          </h1>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search posts, communities, users..."
              onSearchChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Search Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTypeChange('post')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  initialSearchType === 'post'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => handleTypeChange('community')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  initialSearchType === 'community'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Communities
              </button>
              <button
                onClick={() => handleTypeChange('user')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  initialSearchType === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                People
              </button>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex gap-2">
              <select
                value={initialSortBy}
                onChange={(e) => handleSortChange(e.target.value as 'relevance' | 'newest' | 'popular')}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium"
              >
                Filters
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:block px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters Sidebar - Desktop */}
          {showFilters && (
            <div className="hidden lg:block lg:col-span-1">
              <AdvancedFilters onFiltersChange={handleFiltersApply} />
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <div className="mb-6 md:hidden">
                <AdvancedFilters onFiltersChange={handleFiltersApply} />
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && results.length === 0 && initialSearchTerm && (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No results found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{initialSearchTerm}"
                </div>
                <SearchResults 
                  results={results}
                  loading={loading}
                  error={error}
                  totalResults={results.length}
                />
              </>
            )}

            {/* No Search Yet */}
            {!loading && results.length === 0 && !initialSearchTerm && (
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
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Start Searching
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use the search bar above to find posts, communities, and people
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
