'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearch } from '@hooks/useSearch';

interface SearchBarProps {
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

/**
 * SearchBar Component - Enhanced input field for searching with autocomplete and advanced features
 */
export function SearchBar({
  placeholder = 'Search posts, communities, users...',
  onSearchChange,
  showSuggestions = true,
  className = '',
}: SearchBarProps) {
  // Destructure useSearch hook
  const {
    suggestions,
    updateQuery,
    getSuggestions,
    performSearch,
  } = useSearch();

  // Local state
  const [localQuery, setLocalQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load recent searches from localStorage on mount
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse recent searches');
        }
      }
    }
    return [];
  });

  // Check for voice search support
  const isVoiceSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  /**
   * Save search to recent searches
   */
  const saveToRecentSearches = useCallback((query: string) => {
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  /**
   * Handle search input change with debounce
   */
  const handleInputChange = useCallback(
    async (value: string) => {
      setLocalQuery(value);
      updateQuery(value);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Trigger callback if provided
      if (onSearchChange) {
        onSearchChange(value);
      }

      // Get suggestions with debounce
      if (showSuggestions && value.length >= 2) {
        setSuggestionsLoading(true);
        timeoutRef.current = setTimeout(async () => {
          await getSuggestions(value);
          setSuggestionsLoading(false);
          setShowDropdown(true);
        }, 300);
      } else {
        setShowDropdown(false);
      }
    },
    [onSearchChange, showSuggestions, getSuggestions, updateQuery]
  );

  // Setup voice search recognition
  useEffect(() => {
    if (isVoiceSupported && recognitionRef.current === null) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [isVoiceSupported, handleInputChange]);

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      setLocalQuery(suggestion);
      updateQuery(suggestion);
      setShowDropdown(false);
      saveToRecentSearches(suggestion);

      // Perform search
      await performSearch(suggestion);
    },
    [updateQuery, performSearch, saveToRecentSearches]
  );

  /**
   * Handle recent search click
   */
  const handleRecentSearchClick = useCallback(
    async (search: string) => {
      setLocalQuery(search);
      updateQuery(search);
      setShowDropdown(false);

      // Perform search
      await performSearch(search);
    },
    [updateQuery, performSearch]
  );

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (localQuery.trim()) {
        saveToRecentSearches(localQuery.trim());
        // Navigate to search page with query
        window.location.href = `/search?q=${encodeURIComponent(localQuery.trim())}`;
      }
    },
    [localQuery, saveToRecentSearches]
  );

  /**
   * Handle voice search
   */
  const handleVoiceSearch = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (showSuggestions && (suggestions.length > 0 || recentSearches.length > 0 || localQuery.length < 2)) {
                setShowDropdown(true);
              }
            }}
            placeholder={placeholder}
            className="
              w-full
              px-5 py-4 pl-14 pr-20
              border border-gray-200/80 rounded-2xl
              bg-white/50 hover:bg-white hover:border-gray-300
              focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
              dark:bg-gray-800/50 dark:border-gray-600/80 dark:text-white
              dark:hover:bg-gray-800 dark:hover:border-gray-500
              dark:focus:bg-gray-800 dark:focus:border-blue-400 dark:focus:ring-blue-400/10
              transition-all duration-300
              shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-blue-500/10
              backdrop-blur-sm
              text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
              min-h-[3.5rem]
            "
            aria-label="Search"
            role="searchbox"
            autoComplete="off"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Right Side Buttons */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
            {/* Voice Search Button */}
            {isVoiceSupported && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                disabled={isListening}
                className={`
                  p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95
                  ${isListening
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }
                `}
                aria-label={isListening ? "Listening..." : "Voice search"}
                title={isListening ? "Listening..." : "Voice search"}
              >
                <svg
                  className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}

            {/* Loading Indicator */}
            {suggestionsLoading && (
              <div className="p-1.5">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}

            {/* Clear Button */}
            {localQuery && !suggestionsLoading && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  updateQuery('');
                  setShowDropdown(false);
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-white/95 dark:bg-gray-800/95
            backdrop-blur-md
            border border-gray-200/50 dark:border-gray-700/50
            rounded-2xl shadow-2xl shadow-gray-900/10
            overflow-hidden
            animate-in slide-in-from-top-2 fade-in duration-200
          "
        >
          {/* Recent Searches Section */}
          {localQuery.length < 2 && recentSearches.length > 0 && (
            <div className="border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-700/30">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleRecentSearchClick(search)}
                  className="
                    w-full px-4 py-3 text-left
                    hover:bg-gray-100/80 dark:hover:bg-gray-700/80
                    border-b border-gray-100 dark:border-gray-700 last:border-b-0
                    transition-all duration-200 hover:translate-x-1
                    group
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{search}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions Section */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Suggestions
                </h3>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="
                    w-full px-4 py-3 text-left
                    hover:bg-gray-100/80 dark:hover:bg-gray-700/80
                    border-b border-gray-100 dark:border-gray-700 last:border-b-0
                    transition-all duration-200 hover:translate-x-1
                    group
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {suggestions.length === 0 && !suggestionsLoading && localQuery.length >= 2 && (
            <div className="px-6 py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No suggestions found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
