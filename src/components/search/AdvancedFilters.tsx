'use client';

import { useState } from 'react';
import { SearchFilters } from '@services/search.service';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
}

/**
 * AdvancedFilters Component - Panel for advanced search filtering
 */
export function AdvancedFilters({ onFiltersChange, onClose }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [tags, setTags] = useState<string>('');

  const handleApplyFilters = () => {
    const appliedFilters: SearchFilters = {};

    if (filters.communityId) {
      appliedFilters.communityId = filters.communityId;
    }

    if (filters.authorId) {
      appliedFilters.authorId = filters.authorId;
    }

    if (filters.minVotes !== undefined) {
      appliedFilters.minVotes = filters.minVotes;
    }

    if (dateRange.start || dateRange.end) {
      appliedFilters.dateRange = {
        startDate: dateRange.start ? new Date(dateRange.start) : new Date(0),
        endDate: dateRange.end ? new Date(dateRange.end) : new Date(),
      };
    }

    if (tags) {
      appliedFilters.tags = tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    }

    onFiltersChange(appliedFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange({ start: '', end: '' });
    setTags('');
    onFiltersChange({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Community Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Community
        </label>
        <input
          type="text"
          placeholder="Filter by community ID"
          value={filters.communityId || ''}
          onChange={(e) => setFilters({ ...filters, communityId: e.target.value })}
          className="
            w-full px-3 py-2
            border border-gray-300 dark:border-gray-600
            rounded-md bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Author Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Author ID
        </label>
        <input
          type="text"
          placeholder="Filter by author user ID"
          value={filters.authorId || ''}
          onChange={(e) => setFilters({ ...filters, authorId: e.target.value })}
          className="
            w-full px-3 py-2
            border border-gray-300 dark:border-gray-600
            rounded-md bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Minimum Votes Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Minimum Votes: {filters.minVotes || 0}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={filters.minVotes || 0}
          onChange={(e) => setFilters({ ...filters, minVotes: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="
              w-full px-3 py-2
              border border-gray-300 dark:border-gray-600
              rounded-md bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="
              w-full px-3 py-2
              border border-gray-300 dark:border-gray-600
              rounded-md bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g., javascript, react, nextjs"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="
            w-full px-3 py-2
            border border-gray-300 dark:border-gray-600
            rounded-md bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleApplyFilters}
          className="
            flex-1 px-4 py-2
            bg-blue-600 hover:bg-blue-700 text-white
            rounded-md font-medium
            transition-colors duration-200
          "
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="
            flex-1 px-4 py-2
            bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-900 dark:text-white
            rounded-md font-medium
            transition-colors duration-200
          "
        >
          Clear
        </button>
      </div>
    </div>
  );
}
