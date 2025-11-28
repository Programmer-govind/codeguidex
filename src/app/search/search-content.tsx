'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearch } from '@hooks/useSearch';
import { SearchResults } from '@components/search/SearchResults';
import { SearchBar } from '@components/search/SearchBar';
import { AdvancedFilters } from '@components/search/AdvancedFilters';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { SearchFilters } from '@services/search.service';
import { SubNav } from '@/components/navigation/SubNav';

const SEARCH_NAV = [
  { label: 'All Results', href: '/search', icon: '🔍' },
  { label: 'Posts', href: '/posts', icon: '📝' },
  { label: 'Communities', href: '/communities', icon: '👥' },
  { label: 'People', href: '/mentors', icon: '👤' },
];

/**
 * Search Page Content Component - Enhanced Enterprise Version
 * Contains all search logic with professional styling and navigation
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="section">
        <div className="section-container">
          {/* SubNav - Tabbed Navigation */}
          <SubNav items={SEARCH_NAV} showBorder={true} />

          {/* Search Header */}
          <div className="section-header mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {initialSearchTerm ? `Search Results for "${initialSearchTerm}"` : 'Search CodeGuideX'}
            </h1>
            <p className="section-subtitle">
              {initialSearchTerm 
                ? `Found ${results?.length || 0} results for your search`
                : 'Discover posts, communities, mentors, and more'}
            </p>
          </div>

          {/* Search Bar - Enhanced */}
          <div className="mb-8 card-lg">
            <SearchBar
              placeholder="Search posts, communities, mentors, skills, topics..."
              onSearchChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Search Controls - Redesigned */}
          <div className="mb-8 space-y-4">
            {/* Type & Sort Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Type Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleTypeChange('post')}
                  className={`filter-button ${initialSearchType === 'post' ? 'filter-button-active' : ''}`}
                >
                  📝 Posts
                </button>
                <button
                  onClick={() => handleTypeChange('community')}
                  className={`filter-button ${initialSearchType === 'community' ? 'filter-button-active' : ''}`}
                >
                  👥 Communities
                </button>
                <button
                  onClick={() => handleTypeChange('user')}
                  className={`filter-button ${initialSearchType === 'user' ? 'filter-button-active' : ''}`}
                >
                  👤 People
                </button>
              </div>

              {/* Sort & Filter Controls */}
              <div className="flex gap-2 items-center flex-wrap">
                <select
                  value={initialSortBy}
                  onChange={(e) => handleSortChange(e.target.value as 'relevance' | 'newest' | 'popular')}
                  className="select-input text-sm"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>

                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="md:hidden button-secondary"
                >
                  🔧 Filters
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden md:inline-flex button-secondary"
                >
                  {showFilters ? '✕ Hide Filters' : '🔧 Show Filters'}
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <div className="md:hidden card-lg">
                <AdvancedFilters onFiltersChange={handleFiltersApply} />
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            {showFilters && (
              <div className="hidden md:block">
                <div className="card-lg sticky top-24">
                  <div className="card-title mb-4">🔧 Filters</div>
                  <AdvancedFilters onFiltersChange={handleFiltersApply} />
                </div>
              </div>
            )}

            {/* Results Section */}
            <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {/* Loading State */}
              {loading && (
                <div className="card-lg flex items-center justify-center py-16">
                  <LoadingSpinner />
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="card-lg border-2 border-red-200 bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-red-900">Search Error</h3>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && initialSearchTerm && (!results || results.length === 0) && (
                <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">No Results Found</h3>
                  <p className="text-blue-700 mb-4">
                    We couldn't find anything matching "{initialSearchTerm}"
                  </p>
                  <p className="text-sm text-blue-600">
                    Try using different keywords, or browse our featured content instead
                  </p>
                </div>
              )}

              {/* No Search State */}
              {!loading && !error && !initialSearchTerm && (
                <div className="card-lg border-2 border-gray-200 bg-gray-50 p-12 text-center rounded-lg">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Searching</h3>
                  <p className="text-gray-600 mb-4">
                    Use the search bar above to find posts, communities, and mentors
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-left">
                    <div className="p-3 bg-white rounded border">
                      <span className="text-xl">📝</span> Posts
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <span className="text-xl">👥</span> Communities
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <span className="text-xl">👤</span> Mentors
                    </div>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {!loading && !error && results && results.length > 0 && (
                <div>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid gap-4">
                    <SearchResults 
                      results={results} 
                      loading={loading}
                      error={error}
                      totalResults={results.length}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
